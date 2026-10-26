export function AboutPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 pt-8 sm:px-6">
      <h1 className="text-[34px]">About</h1>
      <div className="prose mt-4 text-[15px] text-ink-2">
        <p>SARAS Lab is our own 3D robotics lab: a place to design, build, wire, check and test robot designs before touching hardware, and to keep a record of what worked.</p>
        <h2>Credits</h2>
        <p>SARAS (Smart Autonomous Robotic AI System) was designed and built by Tech With Anant. The reference design, the build steps and the three real-world fixes come from his two videos: the <a href="https://www.youtube.com/watch?v=IT1uBUsOmUY">hardware build</a> and the <a href="https://www.youtube.com/watch?v=e-nbSGRFP4Q">system overview</a>.</p>
        <h2>Licenses</h2>
        <p>Code: MIT. Tutorial text: CC BY-SA 4.0 with credit to Tech With Anant. 3D bodies are procedural; any future GLB models will carry their own attribution here.</p>
        <h2 id="changelog">Changelog</h2>
        <ul>
          <li><strong>M1</strong> — Foundation and 3D core: beige design system, header, persistent canvas, parametric chassis, procedural SARAS parts with a live face, orbit / pan / zoom on every input, camera flights, explode, hover and select, Lab home, Workbench shell with BOM, Parts with 3D cards.</li>
          <li><strong>M0</strong> — Plan.</li>
        </ul>
      </div>
    </div>
  )
}
