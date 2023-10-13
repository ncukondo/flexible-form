export const sampleTomlDefinition = `title="Test Form"
description="desctiption of form"

[[items]]
type="constant"
question="constant_sample"
id="constant_test"
value="value"

[[items]]
id="id_sample"
question="Short Text"
required=true
description="description for question"
type="short_text"

[[items]]
question="Long Text"
description="description for question"
type="long_text"

[[items]]
question="Single Choice"
description="description for question"
type="choice"
items=[
  "option1",
  "option2",
  "option3",
  "option4",
]

[[items]]
question="Multiple Choice"
description="description for question"
multiple=true
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
multiple=true
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
]`