export function DocsPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 pt-8 sm:px-6">
      <h1 className="text-[34px]">Docs</h1>
      <div className="prose mt-4 text-[15px] text-ink-2">
        <h2 id="controls">3D controls</h2>
        <table>
          <thead><tr><th>Input</th><th>Orbit</th><th>Pan</th><th>Zoom</th><th>Select</th></tr></thead>
          <tbody>
            <tr><td>Mouse</td><td>left drag</td><td>right drag</td><td>wheel</td><td>click · double-click flies to the part</td></tr>
            <tr><td>Trackpad</td><td>one-finger drag</td><td>two-finger drag</td><td>pinch</td><td>click</td></tr>
            <tr><td>Touch</td><td>one finger</td><td>two fingers</td><td>pinch</td><td>tap</td></tr>
            <tr><td>Keyboard (view focused)</td><td>arrows</td><td>Shift + arrows</td><td>+ / −</td><td>—</td></tr>
          </tbody>
        </table>

        <h2 id="shortcuts">Keyboard shortcuts</h2>
        <table>
          <thead><tr><th>Key</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td><kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd></td><td>Iso, Top, Front, Side views (camera flies)</td></tr>
            <tr><td><kbd>Home</kbd> or <kbd>0</kbd></td><td>Fit the whole robot</td></tr>
            <tr><td><kbd>F</kbd></td><td>Fly to the selected part</td></tr>
            <tr><td><kbd>E</kbd></td><td>Toggle exploded view</td></tr>
            <tr><td><kbd>O</kbd></td><td>Toggle auto-orbit when idle</td></tr>
            <tr><td><kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd></td><td>Search pages, parts and parts in the design</td></tr>
          </tbody>
        </table>

        <h2 id="axes">Axes and units</h2>
        <p>Millimetres everywhere. <code>x</code> is the robot's right, <code>y</code> is up, <code>z</code> is the robot's back, so the robot faces <code>−z</code>. The base plate's top surface is <code>y = 0</code>; the floor sits one wheel radius under the motor axis.</p>

        <h2 id="format">Design and part format</h2>
        <p>A design holds a chassis (parametric parameters, later imported meshes), a list of placements (<code>instanceId</code>, <code>componentId</code>, tier, position, rotation, mirrored, explode direction), connections (M4) and assumptions. Parts are JSON files validated by a Zod schema: body shape and size, decor primitives, mass, power, price, gotchas. See <code>PLAN.md</code> §8 in the repository for the full schema.</p>

        <h2 id="animation">Animation and motion</h2>
        <p>Camera flights take about half a second, explode eases over a quarter of a second, parts lift slightly on hover, the face on the display blinks. With the system “reduce motion” setting on, the auto-orbit stops and transitions become instant.</p>
      </div>
    </div>
  )
}
