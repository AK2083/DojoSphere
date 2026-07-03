# CodeQL setup (repository maintainers)

DojoSphere uses **advanced CodeQL** via [`.github/workflows/codeql.yml`](./workflows/codeql.yml).

GitHub does not allow **default setup** and **advanced setup** at the same time. If both are enabled, the workflow fails when uploading SARIF with:

```text
CodeQL analyses from advanced configurations cannot be processed when the default setup is enabled
```

## One-time repository setting

1. Open **Settings** → **Code security** (or **Advanced Security**).
2. Under **Code scanning** → **CodeQL analysis**, open the **⋯** menu.
3. If you see **Switch to advanced**, default setup is currently active.
4. Choose **Disable CodeQL** to turn off default setup.
5. Re-run the **CodeQL** workflow (or push to `main`).

After that, only `.github/workflows/codeql.yml` runs CodeQL. The README badge points to that workflow.

## Alternative

To use GitHub’s default setup instead, delete `codeql.yml`, disable this workflow, and enable CodeQL default setup in repository settings. Do not use both.
