import { Callout, Chip } from '../ui/Card'

const HARDWARE = [
  ['0', 'Start here', 'What SARAS is, cost, time, safety'],
  ['1', 'Design and chassis', 'Three tiers in Fusion 360; print, cardboard or acrylic'],
  ['2', 'Motors and wheels', 'Mounting, the standoff fix for tyre clearance'],
  ['3', 'Wire motors to the L298N', 'Pair left and right, mind the polarity'],
  ['4', 'Tier 2 and the battery bay', 'Standoffs, keeping the power bank from sliding'],
  ['5', 'Mount the Raspberry Pi', 'Standoffs and cable access'],
  ['6', 'Power: what failed and what works', 'Dual-output bank, buck attempt, split rails, LiPo + UBEC'],
  ['7', 'Pi ↔ L298N and the first drive', 'GPIO pin map, keyboard test'],
  ['8', 'The turning problem', 'Torque vs friction, tape on the tread'],
  ['9', 'Build the head', 'Neck, display, camera the right way up, mic, speaker'],
  ['10', 'Ultrasonic sensors', 'Front, left, right; the ECHO divider'],
  ['11', 'First boot', 'Power order, boot log, quick spin'],
  ['12', 'Upgrade paths', 'Single LiPo rail, TB6612FNG, Pi 5, SARAS 2.0'],
]
const SOFTWARE = [
  ['1', 'Pi OS and Python setup', 'venv, camera, audio, gpiozero / lgpio'],
  ['2', 'Motor control', 'saras_config.py from the Workbench, PWM speed'],
  ['3', 'Manual mode', 'Xbox controller, dead zones, kill switch'],
  ['4', 'Face on the display', 'idle, listening, thinking, talking'],
  ['5', 'Wake word and speech-to-text', 'openWakeWord or Porcupine; Whisper or Vosk'],
  ['6', 'The brain', 'Llama via Ollama or the OpenAI API; intent routing'],
  ['7', 'Text-to-speech', 'Piper locally'],
  ['8', 'Vision', 'picamera2 + LLaVA: what do you see'],
  ['9', 'Go to an object', 'look → describe → steer; front sensor stop'],
  ['10', 'Autonomous exploration', 'move log fed back into the prompt; mission report'],
  ['11', 'Logs and a map', 'replaying runs, towards a 2D map'],
  ['12', 'Going fully offline', 'model sizes vs Pi RAM; when to go bigger'],
]

export function TutorialPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 pt-8 sm:px-6">
      <h1 className="text-[34px]">Tutorial</h1>
      <p className="mt-1 max-w-2xl text-[15px] text-ink-2">
        The full SARAS build in two tracks. Each step will show the matching 3D state beside it and end with a checkpoint that runs in the Workbench. The outline is here now; the written steps land in M7, after the lab itself works.
      </p>
      <Callout kind="note" title="Status">
        Outline only. Hardware steps follow the build video; software steps are reconstructed from the overview video and standard open-source tooling, and will be revised when the creator's software video ships.
      </Callout>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <Track title="Hardware track" steps={HARDWARE} />
        <Track title="Software track" steps={SOFTWARE} />
      </div>

      <section id="troubleshooting" className="mt-16">
        <h2 className="text-[24px]">Troubleshooting index</h2>
        <p className="mt-1 text-[14px] text-ink-2">Symptom → likely cause → rule → step. Seeded with the problems from the videos.</p>
        <ul className="prose mt-4 text-[14px] text-ink-2">
          <li>Robot won't turn in place → big tyres, low torque → MOT-004 → step 8</li>
          <li>Motors fight each other or nothing moves → pair wired with opposite polarity → MOT-001 → step 3</li>
          <li>Pi reboots when motors start → shared supply or weak rail → PWR-004 / PWR-003 → step 6</li>
          <li>Power bank switches off under load → one port at a time → PWR-004 → step 6</li>
          <li>Camera image upside down → mounted rotated → CAM-002 → step 9</li>
          <li>Wheels rub the chassis → motors too far in → MECH-002 → step 2</li>
          <li>Ultrasonic reads 0 or max → ECHO without divider or soft target → GPIO-002 / SEN-001 → step 10</li>
        </ul>
      </section>
    </div>
  )
}

function Track({ title, steps }: { title: string; steps: string[][] }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-[22px]">{title}</h2>
        <Chip>M7</Chip>
      </div>
      <ol className="relative border-l border-line pl-5">
        {steps.map(([n, t, d]) => (
          <li key={n} className="relative mb-4">
            <span className="absolute -left-[27px] top-1 flex h-5 w-5 items-center justify-center rounded-full border border-line-strong bg-bg-elev text-[10px] font-semibold text-ink-2">{n}</span>
            <div className="text-[15px] font-medium text-ink">{t}</div>
            <div className="text-[13px] text-ink-2">{d}</div>
          </li>
        ))}
      </ol>
    </section>
  )
}
