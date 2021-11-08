# Shortcut Workflow State Action

Move stories between workflow states.

## Inputs

### `shortcutToken`

_Required._ Shortcut API auth token.

### `fromStateId`

_Required._ Move from state id.

### `toStateId`

_Required._ Move to state id.

## Example usage

```yaml
uses: perdoo/shortcut-workflow-state-action@v2.0.0
with:
  shortcutToken: ${{ secrets.SHORTCUT_TOKEN }}
  fromStateId: 12345
  toStateId: 67890
```

To get your workflow state ids, use:

```shell
curl -X GET \
  -H "Content-Type: application/json" \
  -H "Shortcut-Token: $SHORTCUT_TOKEN" \
  -L "https://api.app.shortcut.com/api/v3/workflows"
```
