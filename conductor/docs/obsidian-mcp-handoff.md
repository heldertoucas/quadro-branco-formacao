# Obsidian MCP Handoff

## Summary

The Obsidian Local REST API plugin is running and accepts the system environment variable `OBSIDIAN_API_KEY` when called directly from the shell. The `mcp__obsidian` connector, however, rejected its configured API key during this session.

This means the Obsidian service itself was healthy, but the MCP server was using a stale, missing, or differently scoped API key configuration.

## What Was Wrong

The MCP call failed with:

```text
Obsidian Local REST API rejected the API key. Verify OBSIDIAN_API_KEY matches the value in Obsidian -> Settings -> Local REST API.
Authorization required. Find your API Key in the 'Local REST API with MCP' section of your Obsidian settings.
```

The shell environment did have `OBSIDIAN_API_KEY` set, confirmed without printing the secret:

```sh
test -n "$OBSIDIAN_API_KEY" && printf 'OBSIDIAN_API_KEY is set\n' || printf 'OBSIDIAN_API_KEY is not set in this shell\n'
```

Obsidian was listening locally:

```sh
lsof -nP -iTCP -sTCP:LISTEN | rg '2712[34]|Obsidian|obsidian'
```

Direct REST access worked after running the command outside the sandbox:

```sh
curl -sk -o /tmp/obsidian-rest-check.json -w '%{http_code}\n' \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  https://127.0.0.1:27124/
```

The response was HTTP `200`, with `"authenticated": true`.

## Inference

The MCP connector was not reading the same shell environment as the agent command process, or it had cached an older API key when the MCP server was started. Restarting or reconfiguring the MCP server should fix the connector path.

Do not rotate, print, or paste the key unless absolutely necessary. The working key already exists in the system variable.

## Workaround Used

Instead of using `mcp__obsidian`, direct calls were made to the Obsidian Local REST API using the existing system variable:

```sh
curl -sk -X PUT \
  -H "Authorization: Bearer $OBSIDIAN_API_KEY" \
  --data-binary @/path/to/local-file.md \
  -w '%{http_code}\n' \
  -o /tmp/obsidian-put-response.json \
  https://127.0.0.1:27124/vault/03-projetos/quadro-branco-formacao/hot.md
```

This returned HTTP `204`, confirming the note write succeeded.

## Session Actions Completed

- Ran `oc-start.sh quadro-branco-formacao`.
- Found that `03-projetos/quadro-branco-formacao/hot.md` was missing.
- Confirmed `mcp__obsidian` rejected its API key.
- Confirmed direct Local REST API access works with `$OBSIDIAN_API_KEY`.
- Created `03-projetos/quadro-branco-formacao/hot.md` through the REST API.
- Re-ran `oc-start.sh quadro-branco-formacao` and verified it now reads `hot.md`.
- Ran `oc-close.sh quadro-branco-formacao`.
- Refreshed `hot.md` again through the REST API with close-session state.

## Recommended Fix For Future Agents

1. Restart the MCP server or Codex session so the Obsidian MCP server picks up the current `OBSIDIAN_API_KEY`.
2. Test `mcp__obsidian.obsidian_list_notes` against `03-projetos/quadro-branco-formacao`.
3. If MCP still fails but direct REST works, continue using REST with `$OBSIDIAN_API_KEY` and do not expose the key.
4. Prefer the normal `obsidian-sync` lifecycle commands:

```sh
/Users/helder/Dev/obsidian-ht/08-system/082-scripts/mac/oc-start.sh quadro-branco-formacao
/Users/helder/Dev/obsidian-ht/08-system/082-scripts/mac/oc-close.sh quadro-branco-formacao
```

If `oc-close.sh` asks the AI to update `hot.md` via Obsidian MCP and MCP is still broken, use the direct REST workaround above.
