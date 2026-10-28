# Architecture decisions

## Keep the first version lightweight
Use browser-native HTML, CSS, and JavaScript modules. Avoid a build system or backend until needed.

## Stable IDs for connections
Components and pins receive IDs; wires reference pin IDs instead of screen coordinates.

## Make simulation limits explicit
The initial solver supports a narrow series estimate. Unsupported configurations should return clear errors.

## Isolate Arduino runtime integration
Keep code execution behind an adapter. Evaluate licensing, browser support, maintenance, and integration complexity before selecting an emulator.
