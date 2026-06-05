/**
 * Integration test: carry-forward cycle end-to-end.
 *
 * Verifies the full pedagogical loop:
 *   projectInit (course) -> intelligentSave (reflection with carry-forward)
 *   -> process log check -> contextLoad (carry-forward resolved)
 *   -> intelligentSave (lesson plan) -> process log check
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createTempWorkspace, type TempWorkspace } from '../helpers/setup.js';
import { projectInit } from '../../src/tools/setup/project-init.js';
import { intelligentSave } from '../../src/tools/composite/intelligent-save.js';
import { contextLoad } from '../../src/tools/mechanical/context-load.js';
import { readProcessLog } from '../../src/utils/process-log.js';
import { setServerWorkspace } from '../../src/tools/core/workspace.js';

// ============================================================================
// FIXTURES
// ============================================================================

let workspace: TempWorkspace;
let projectPath: string;

beforeEach(async () => {
  workspace = await createTempWorkspace('carry-forward-cycle-');
  projectPath = path.join(workspace.dir, 'test-course');
  setServerWorkspace(workspace.dir);
});

afterEach(async () => {
  await workspace.cleanup();
});

// ============================================================================
// CARRY-FORWARD CYCLE
// ============================================================================

describe('carry-forward cycle (end-to-end)', () => {
  it('completes the full reflect -> context-load -> plan cycle', async () => {
    // ---------------------------------------------------------------
    // Step 1: projectInit with course
    // ---------------------------------------------------------------
    const initResult = await projectInit({
      project_path: projectPath,
      name: 'Integration Test Course',
      type: 'course',
      course: 'TEST_INT_001',
    });

    expect(initResult.success).toBe(true);
    expect(initResult.folders_created).toContain('_system');
    expect(initResult.folders_created).toContain('Reflections');
    expect(initResult.folders_created).toContain('Lesson_Plans');

    // Verify process log was initialised
    const initialLog = await readProcessLog(projectPath);
    expect(initialLog.course_instance).toBe('TEST_INT_001');
    expect(initialLog.entries).toHaveLength(0);

    // ---------------------------------------------------------------
    // Step 2: intelligentSave a reflection with ## Carry-forward
    // ---------------------------------------------------------------
    const reflectionContent = `# Reflection on Lesson 3 — Cell Division

## Description
Taught mitosis using whiteboard diagrams. Students seemed engaged initially
but lost focus during the prophase/metaphase distinction.

## Feelings
Felt rushed during the second half. Should have allocated more time.

## Evaluation
The diagrams worked well for anaphase but the earlier stages need
a different approach.

## Analysis
Visual complexity overload: too many new terms introduced simultaneously.
Scaffolding needed.

## Conclusion
Split the lesson into two: one for early stages, one for anaphase/telophase.

## Carry-forward

- Use interactive animation for prophase/metaphase next time
- Reduce terminology load: introduce max 3 new terms per segment
- Ask students to draw their own diagrams before showing the correct version
`;

    const reflectionResult = await intelligentSave({
      content: reflectionContent,
      content_type: 'reflection',
      context: {
        workspace: projectPath,
        course: 'TEST_INT_001',
        lesson: 3,
        framework: 'gibbs',
        tags: ['celldelning', 'mitosis', 'scaffolding'],
      },
      auto_confirm: true,
    });

    expect(reflectionResult.success).toBe(true);
    expect(reflectionResult.filepath).toBeDefined();
    expect(reflectionResult.filepath).toContain('Reflections');

    // ---------------------------------------------------------------
    // Step 3: Verify process log has 'reflected' event with carry_forward_in
    // ---------------------------------------------------------------
    const logAfterReflection = await readProcessLog(projectPath);
    expect(logAfterReflection.entries.length).toBeGreaterThanOrEqual(1);

    // Find the reflected event
    const reflectedEvents = logAfterReflection.entries.flatMap(e => e.events)
      .filter(ev => ev.type === 'reflected');
    expect(reflectedEvents).toHaveLength(1);

    const reflectedEvent = reflectedEvents[0];
    expect(reflectedEvent.carry_forward_in).toBeDefined();
    expect(reflectedEvent.carry_forward_in).toContain('Reflections/');

    // ---------------------------------------------------------------
    // Step 4: contextLoad -> verify carry_forward field has actual text
    // ---------------------------------------------------------------
    const contextResult = await contextLoad({ workspace: projectPath });

    expect(contextResult.success).toBe(true);
    expect(contextResult.config_source).toBe('_config');
    expect(contextResult.carry_forward).toBeDefined();
    expect(contextResult.carry_forward).not.toBeNull();

    // The carry-forward content should contain the actual bullet points
    const cfContent = contextResult.carry_forward!.content;
    expect(cfContent).toContain('interactive animation');
    expect(cfContent).toContain('terminology load');
    expect(cfContent).toContain('draw their own diagrams');

    // Should be linked to lesson 3
    expect(contextResult.carry_forward!.lesson).toBe(3);

    // Process log summary should show reflected event
    expect(contextResult.process_log_summary).toContain('reflected: 1');

    // ---------------------------------------------------------------
    // Step 5: intelligentSave a lesson plan
    // ---------------------------------------------------------------
    const lessonPlanContent = `# Lesson Plan — Lesson 4: Cell Division (Part 2)

## Learning Objectives
- LO5: Describe the stages of mitosis in correct order
- LO6: Explain the role of spindle fibres

## Based on
Previous reflection: use interactive animation, limit new terms.

## Activities
1. (10 min) Recap: students draw mitosis stages from memory
2. (15 min) Interactive animation: prophase and metaphase
3. (10 min) Pair discussion: compare diagrams with animation
4. (10 min) Introduction: anaphase and telophase (max 3 new terms)
5. (5 min) Exit ticket: sequence the stages

## Materials
- Whiteboard
- Animation software (prepared)
- Exit ticket handout
`;

    const planResult = await intelligentSave({
      content: lessonPlanContent,
      content_type: 'lesson_plan',
      context: {
        workspace: projectPath,
        course: 'TEST_INT_001',
        lesson: 4,
        tags: ['celldelning', 'mitosis'],
        learning_objectives: ['LO5', 'LO6'],
        based_on: [reflectionResult.filepath!],
      },
      auto_confirm: true,
    });

    expect(planResult.success).toBe(true);
    expect(planResult.filepath).toBeDefined();
    expect(planResult.filepath).toContain('Lesson_Plans');

    // ---------------------------------------------------------------
    // Step 6: Verify process log has 'planned' event
    // ---------------------------------------------------------------
    const logAfterPlan = await readProcessLog(projectPath);

    const plannedEvents = logAfterPlan.entries.flatMap(e => e.events)
      .filter(ev => ev.type === 'planned');
    expect(plannedEvents).toHaveLength(1);

    const plannedEvent = plannedEvents[0];
    expect(plannedEvent.file).toContain('Lesson_Plans/');

    // Total events: 1 reflected + 1 planned
    const totalEvents = logAfterPlan.entries.flatMap(e => e.events);
    expect(totalEvents).toHaveLength(2);
  });
});
