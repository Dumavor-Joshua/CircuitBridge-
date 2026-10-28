# CircuitBridge

CircuitBridge is an educational electronics workspace for students and makers, starting with circuit editing and basic electrical simulation.

## Status

Early scaffold. The circuit model and connection validation come first, followed by the visual editor, a limited DC solver, and an Arduino GPIO prototype.

## Principles

- Keep the app lightweight and mobile-aware.
- Separate project data, editor, simulation, and Arduino runtime.
- Wires reference stable pin IDs, never canvas coordinates.
- State solver limitations clearly and test against known examples.

## Run locally

Serve this folder over HTTP because it uses JavaScript modules:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000.
