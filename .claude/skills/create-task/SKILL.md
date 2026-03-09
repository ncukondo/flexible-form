# Skill: create-task

Create a new task spec file from template.

## Trigger

User runs `/create-task <kebab-case-name>`.

## Workflow

1. **Determine task number** — Read ROADMAP, find next available `YYYYMMDD-NN`
2. **Create task file** — `spec/tasks/YYYYMMDD-NN-<name>.md` from `_template.md`
3. **Populate sections:**
   - Purpose: Why this task exists
   - Related source files: Files to change
   - Implementation steps: TDD steps with checkboxes
4. **Update ROADMAP** — Add new row with "Not Started" status
5. **Confirm** — Show the created file path

## Rules

- Task files are written in English
- Each step should follow TDD: write test → implement → verify
- Include acceptance criteria for each step
