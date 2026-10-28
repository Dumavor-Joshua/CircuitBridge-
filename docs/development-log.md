# Development log

## Initial scaffold
- Added a responsive landing page and separated CSS/JavaScript modules.
- Defined a versioned JSON project model and serialization helpers.
- Added pin-based wire validation and project validation.
- Added resistor, LED, voltage-source, and switch definitions.
- Added a simplified series-current estimator with explicit limitations.
- Added an Arduino Uno-style GPIO state model; Arduino source execution is not implemented.
- Added starter tests using Node's built-in test runner.

## Next steps
1. Generate unique instance pin IDs when adding components.
2. Expand schema and topology validation.
3. Build the SVG editor and wire interactions.
4. Replace the series estimator with a topology-aware solver.
