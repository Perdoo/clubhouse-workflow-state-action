# Clubhouse Workflow State Action

Move stories between workflow states.

## Inputs

### `chToken`

_Required._ Clubhouse API auth token.

### `fromStateId`

_Required._ Move from state id.

### `toStateId`

_Required._ Move to state id.

## Example usage

```yaml
uses: Perdoo/clubhouse-workflow-state-action@v1
with:
  token: ${{ secrets.CLUBHOUSE_TOKEN }}
  fromStateId: 12345 
  toStateId: 67890
```

To get the workflow state IDs, use:

```shell
curl -X GET \
  -H "Content-Type: application/json" \
  -H "Clubhouse-Token: $CLUBHOUSE_TOKEN" \
  -L "https://api.clubhouse.io/api/v3/workflows"
```
