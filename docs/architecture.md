# Architecture

CircuitBridge separates domain data from UI rendering and simulation.

- `core/`: project schema, component registry, connections, validation.
- `editor/`: workspace and visual component/wire representations; SVG editor planned.
- `components/`: reusable component definitions and default properties.
- `simulation/`: solver contract and result formatting.
- `arduino/`: board/GPIO model and future runtime adapter.
- `storage/`: local project persistence and JSON export.

Wires reference stable pin IDs. Canvas coordinates must not determine electrical connectivity. The current DC solver is only a simplified series estimate and does not solve arbitrary circuit topology.
