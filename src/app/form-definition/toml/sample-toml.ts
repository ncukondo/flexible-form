export const sampleTomlDefinition = `
# This is a sample TOML definition for the form.
# Format of this configuration is TOML(https://toml.io/).
# Texts after # are comments and are ignored.


title="Test Form" # title of form
description="desctiption of form"  # description of form. This is optional.

# Define actions to be executed when the form is submitted. This can be string or array of string.
# Available actions are:
# - log: Log the form data to the server console.
# - mailto: Send the form data to the email address specified.(e.g. mailto:example@example)
# - https: Send the form data to the specified URL via POST method.(e.g. https://example.com)
actions="log:" 

# Define actions to be executed after the form is submitted. This is optional.
[post_submit]
# message is the message to be displayed after the form is submitted.
message="Thank you for your submission."


# Define form items as array of items.
# Available types are:
# - constant: Constant value. This is not editable.
# - short_text: Short text input.
# - long_text: Long text input.
# - choice: Single choice or multiple choice.
# - choice_table: Single choice or multiple choice table.
[[items]]
type="constant" # type of item. This is required.
question="constant_sample" # question of item. This is required.
id="constant_test" # id of item. This is optional. You can use this id to get the value of this item in actions.
value="value" # value of item. This is required only in constant type.

[[items]]
id="id_sample"
question="Short Text"
required=true # This item is required. This is optional. It is false by default.
description="description for question" # description of item. This is optional.
type="short_text"

[[items]]
question="Long Text"
description="description for question"
type="long_text"

[[items]]
question="Single Choice"
description="description for question"
type="choice"

# items is array of choice items.
items=[
  "option1",
  "option2",
  "option3",
  "option4",
]

[[items]]
question="Multiple Choice"
description="description for question"
multiple=true # This item is multiple choice. This is optional. It is false by default.
type="choice"
items=[
  "option1",
  "option2",
  "option3",
  "option4",
]

[[items]]
question="Choice Table"
description="description for question"
type="choice_table"

# items is array of choice items. This is required. This represents the columnss of the table.
items=[
  "option1",
  "option2",
  "option3",
  "option4",
  "option5",
  "option6",
  "option7",
  "option8",
]

# scales is array of choice items. This is required. This represents the rows of the table.
scales=[
  "long long long long long long long long long long scale scale1",
" scale2",
" scale3",
" scale4",
" scale5",
" scale6",
" scale7",
" scale8",
" scale9",
" scale10",
]

[[items]]
question="Multiple Choice Table"
multiple=true # This item is multiple choice. This is optional. It is false by default.
description="description for question"
type="choice_table"
items=[
  "option1",
  "option2",
  "option3",
  "option4",
]
scales=[
  "long long long long long long long long long long scale scale1",
" scale2",
" scale3",
" scale4",
" scale5",
" scale6",
" scale7",
" scale8",
]`;
