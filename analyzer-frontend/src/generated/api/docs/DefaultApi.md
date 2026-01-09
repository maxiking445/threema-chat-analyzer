# DefaultApi

All URIs are relative to */api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**avatarIdGet**](DefaultApi.md#avataridget) | **GET** /avatar/{id} |  |
| [**contactsGet**](DefaultApi.md#contactsget) | **GET** /contacts/ | Get all contacts with message counts |
| [**contactsTimelineGet**](DefaultApi.md#contactstimelineget) | **GET** /contacts/timeline | Sums up messages from each person in contact during one day |
| [**groupsGet**](DefaultApi.md#groupsget) | **GET** /groups |  |
| [**groupsTimelineGet**](DefaultApi.md#groupstimelineget) | **GET** /groups/timeline | Sums up messages from each person in group during one day |
| [**usersGet**](DefaultApi.md#usersget) | **GET** /users |  |
| [**wordcloudGet**](DefaultApi.md#wordcloudget) | **GET** /wordcloud | Get most frequent words |



## avatarIdGet

> Blob avatarIdGet(type, id)



Gets Avatar for CONTACT, Group or Avatar by ID

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { AvatarIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // 'CONTACT' | 'GROUP' | 'AVATAR' | CONTACT, GROUP or AVATAR
    type: type_example,
    // string | ID
    id: id_example,
  } satisfies AvatarIdGetRequest;

  try {
    const data = await api.avatarIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **type** | `CONTACT`, `GROUP`, `AVATAR` | CONTACT, GROUP or AVATAR | [Defaults to `undefined`] [Enum: CONTACT, GROUP, AVATAR] |
| **id** | `string` | ID | [Defaults to `undefined`] |

### Return type

**Blob**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `image/png`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Image |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## contactsGet

> Array&lt;ModelsContact&gt; contactsGet()

Get all contacts with message counts

Fetches all contacts along with their message counts from the database

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ContactsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.contactsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ModelsContact&gt;**](ModelsContact.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successfully loaded contacts |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## contactsTimelineGet

> Array&lt;ModelsContactTimeline&gt; contactsTimelineGet(userId)

Sums up messages from each person in contact during one day

Returns the daily number of messages per user.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { ContactsTimelineGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string | ID of contact (CSV-Name)
    userId: userId_example,
  } satisfies ContactsTimelineGetRequest;

  try {
    const data = await api.contactsTimelineGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | `string` | ID of contact (CSV-Name) | [Defaults to `undefined`] |

### Return type

[**Array&lt;ModelsContactTimeline&gt;**](ModelsContactTimeline.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **400** | contact missing |  -  |
| **500** | internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## groupsGet

> Array&lt;ModelsGroup&gt; groupsGet()



Returns Groups and count of how many messages a user has

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GroupsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.groupsGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ModelsGroup&gt;**](ModelsGroup.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of groups wiht message count |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## groupsTimelineGet

> Array&lt;ModelsGroupTimeline&gt; groupsTimelineGet(group)

Sums up messages from each person in group during one day

Returns the daily number of messages per user for a group.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GroupsTimelineGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string | Name of group (CSV-Name)
    group: group_example,
  } satisfies GroupsTimelineGetRequest;

  try {
    const data = await api.groupsTimelineGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **group** | `string` | Name of group (CSV-Name) | [Defaults to `undefined`] |

### Return type

[**Array&lt;ModelsGroupTimeline&gt;**](ModelsGroupTimeline.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **400** | group missing |  -  |
| **500** | internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## usersGet

> Array&lt;ModelsIdentity&gt; usersGet()



Returns all identities from identity.csv

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { UsersGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.usersGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;ModelsIdentity&gt;**](ModelsIdentity.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## wordcloudGet

> Array&lt;ModelsWordCount&gt; wordcloudGet(limit)

Get most frequent words

Reads all CSV files named &#x60;message_*.csv&#x60; from &#x60;/data&#x60;, analyzes the &#x60;body&#x60; column, counts all words across all rows and returns the most frequent words as JSON.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { WordcloudGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // number | Maximum number of words to return (default 100) (optional)
    limit: 56,
  } satisfies WordcloudGetRequest;

  try {
    const data = await api.wordcloudGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` | Maximum number of words to return (default 100) | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;ModelsWordCount&gt;**](ModelsWordCount.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Most frequent words |  -  |
| **400** | Invalid request parameters |  -  |
| **404** | No message files found |  -  |
| **500** | Internal server error while reading or parsing files |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

