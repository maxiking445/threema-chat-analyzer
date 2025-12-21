
# ModelsGroup


## Properties

Name | Type
------------ | -------------
`archived` | boolean
`creator` | string
`groupUid` | string
`groupname` | string
`id` | string
`members` | Array&lt;string&gt;
`messageCount` | number
`messageCountByUser` | { [key: string]: number; }

## Example

```typescript
import type { ModelsGroup } from ''

// TODO: Update the object below with actual values
const example = {
  "archived": null,
  "creator": null,
  "groupUid": null,
  "groupname": null,
  "id": null,
  "members": null,
  "messageCount": null,
  "messageCountByUser": null,
} satisfies ModelsGroup

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ModelsGroup
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


