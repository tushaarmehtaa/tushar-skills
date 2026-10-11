"""Sound for the launch film, built from src/schedule.json, the same schedule the picture uses.

Two stems, so a licensed music track can replace the bed without touching the edit:
  public/audio/sfx.wav    recorded keys, clicks, tabs and pops (no whooshes) (audio/samples, see fetch-samples.sh)
  public/audio/music.wav  placeholder score: a dark pad that tightens in act 1, a 75 bpm piano in act 2 (one bar per skill)

usage: sh audio/fetch-samples.sh && node scripts/schedule.mjs && python3 audio/score.py
"""
import json, os, subprocess, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
S = json.load(open(os.path.join(ROOT, "src", "schedule.json")))
SR = 48000
FPS = S["fps"]
LEN = S["total"] / FPS
N = int(SR * (LEN + 2))
music = np.zeros((N, 2))
sfx = np.zeros((N, 2))
rng = np.random.default_rng(7)
SC = S["scenes"]

def sec(frame): return frame / FPS
def scene(name): return SC[name]["from"]
def hz(name):
    names = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    return 440.0 * 2 ** ((names[name[:-1]] + 12 * (int(name[-1]) + 1) - 69) / 12)

def add(buf, sig, at, pan=0.0, gain=1.0):
    i = int(at * SR)
    if i >= len(buf) or i < 0: return
    if sig.ndim == 1:
        sig = np.stack([sig * np.sqrt(0.5 * (1 - pan)), sig * np.sqrt(0.5 * (1 + pan))], axis=1)
    sig = sig[: len(buf) - i]
    buf[i:i + len(sig)] += sig * gain

def band(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)
def low(x, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)
def high(x, f, order=2):
    return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)
def env(n, attack, decay):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(attack, 1e-5)) * np.exp(-t / decay)

def reverb(buf, seconds, wet, tone=5000):
    """Stereo room from decaying filtered noise. Cheap, but it puts every sound in the same space."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros_like(buf)
    for ch in range(2):
        ir = low(rng.standard_normal(n), tone) * np.exp(-t * 6.9 / seconds)
        ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
        ir /= np.sqrt(np.sum(ir ** 2))
        out[:, ch] = fftconvolve(buf[:, ch], ir)[: len(buf)]
    return buf * (1 - wet * 0.5) + out * wet

# ---------- Recorded effects ----------
# Real recordings, fetched by audio/fetch-samples.sh (Kenney CC0 interface pack, Mixkit free sound effects).
SAMPLES = os.path.join(HERE, "samples")

def load(name, gain_db=0.0):
    path = os.path.join(SAMPLES, name)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32).astype(np.float64)
    above = np.where(np.abs(x) > np.abs(x).max() * 0.02)[0]
    x = x[max(0, above[0] - int(0.002 * SR)):] if len(above) else x
    return x / (np.abs(x).max() + 1e-9) * 10 ** (gain_db / 20)

def trim(x, start, end, fade=0.01):
    y = x[int(start * SR):int(end * SR)].copy()
    f = int(fade * SR)
    y[-f:] *= np.linspace(1, 0, f)
    return y

def keystrokes_from(name):
    """Slice a real typing recording into single keystrokes; keep the clean, isolated ones."""
    x = load(name)
    w = 96
    e = np.sqrt(np.convolve(x ** 2, np.ones(w) / w, "same"))
    thr = np.percentile(e, 20) * 6
    onsets, last = [], -SR
    for i in range(1, len(e)):
        if e[i] > thr and e[i - 1] <= thr and i - last > int(0.06 * SR):
            onsets.append(i); last = i
    keys = []
    for a, b in zip(onsets, onsets[1:] + [len(x)]):
        if (b - a) / SR < 0.11: continue
        k = x[max(0, a - int(0.003 * SR)):a + min(b - a - int(0.004 * SR), int(0.14 * SR))].copy()
        # Line the loudest click up with the frame the letter appears on.
        k = k[max(0, int(np.abs(k).argmax()) - int(0.004 * SR)):]
        if len(k) < int(0.06 * SR): continue
        k[-int(0.012 * SR):] *= np.linspace(1, 0, int(0.012 * SR))
        k[: int(0.001 * SR)] *= np.linspace(0, 1, int(0.001 * SR))
        keys.append(k / (np.abs(k).max() + 1e-9))
    # Brightness sorts them: the darkest few read as the space bar.
    cent = [np.sum(np.abs(np.fft.rfft(k, 8192)) * np.fft.rfftfreq(8192, 1 / SR)) / np.sum(np.abs(np.fft.rfft(k, 8192))) for k in keys]
    order = np.argsort(cent)
    return [keys[i] for i in order[4:]], [keys[i] for i in order[:4]]

KEYS, SPACES = keystrokes_from("mk-2531.mp3")
ENTER = load("mk-2542.mp3")
MOUSE = trim(load("mk-1113.mp3"), 0, 0.16)
TAB = [load("kenney/Audio/drop_002.ogg"), load("kenney/Audio/drop_003.ogg")]
TAB_CLOSE = [load("kenney/Audio/click_002.ogg"), load("kenney/Audio/click_003.ogg"), load("kenney/Audio/click_005.ogg")]
DONE = load("kenney/Audio/confirmation_001.ogg")
POP = load("mk-3005.mp3")            # explainer pop: logos and tags
NO = trim(load("mk-2569.mp3"), 0, 0.5)  # negative interface tap: the verdict

last_key = [-1]
def key(space=False):
    """A different real keystroke every time, never the same one twice in a row."""
    pool = SPACES if space else KEYS
    i = int(rng.integers(len(pool)))
    if not space and i == last_key[0]: i = (i + 1) % len(pool)
    if not space: last_key[0] = i
    return pool[i] * rng.uniform(0.78, 1.0) * 0.72

def pitched(x, semis):
    """Resample to shift pitch a little, so repeated effects don't sound copy-pasted."""
    r = 2 ** (semis / 12)
    idx = np.arange(0, len(x) - 1, r)
    return np.interp(idx, np.arange(len(x)), x)

def piano(f, dur=3.0, amp=0.2):
    """Additive piano-ish note: slightly stretched partials, faster decay up high, a felt hammer."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.zeros(n)
    for k in range(1, 9):
        fk = f * k * np.sqrt(1 + 0.00035 * k * k)
        if fk > 16000: break
        sig += (1 / k ** 1.25) * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.28)) * np.exp(-t * (0.9 + 0.55 * k) * (f / 260) ** 0.35)
    sig += low(rng.standard_normal(n), 2500) * env(n, 0.0005, 0.006) * 0.08
    sig *= np.minimum(1, t / 0.003) * np.clip((dur - t) / 0.25, 0, 1)
    return low(sig, 5200) * amp

def pad(freqs, dur, amp=0.05, attack=1.5, release=1.5, bright=1800):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    for f in freqs:
        for ch, det in ((0, -0.0035), (1, 0.0035)):
            ph = 2 * np.pi * f * (1 + det) * t
            saw = sum(np.sin(ph * k) / k for k in range(1, 7))
            out[:, ch] += saw
    shape = np.minimum(1, t / attack) * np.clip((dur - t) / release, 0, 1)
    for ch in range(2):
        out[:, ch] = low(out[:, ch], bright) * shape
    return out * amp / len(freqs)

def kick(amp=0.5):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 44 + 90 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * amp

def shaker(amp=0.03):
    n = int(0.07 * SR)
    return high(rng.standard_normal(n), 6000) * env(n, 0.004, 0.018) * amp

# ---------- Act 1: the searches ----------
browser_end = sec(SC["browser"]["duration"])
EN = S["endless"]
for i, s in enumerate(S["searches"]):
    if i > 0:
        add(sfx, MOUSE, sec(s["at"] - 4), pan=0.25, gain=0.55)
    for k in s["keys"]:
        add(sfx, key(k["ch"] == " "), sec(k["t"]), pan=rng.uniform(-0.1, 0.1), gain=0.3)
    add(sfx, key(), sec(s["pick"]), gain=0.26)
    add(sfx, ENTER, sec(s["enter"]), gain=0.36)
    for j, at in enumerate(s["tabsAt"]):
        add(sfx, MOUSE, sec(at), pan=0.25, gain=0.5)
        add(sfx, pitched(TAB[j % 2], j * 0.7), sec(at) + 0.03, pan=-0.35 + 0.18 * j, gain=0.32)

# The spiral: typing gets frantic, tabs crackle open, a riser into the hard cut.
qs = EN["queries"] + [EN["to"]]
for k in range(len(qs) - 1):
    span = qs[k + 1] - qs[k]
    # A frantic human, not a machine gun: at most about 14 keys a second.
    t = sec(qs[k])
    while t < sec(qs[k + 1]) - 0.02:
        add(sfx, key(rng.random() < 0.16), t, pan=rng.uniform(-0.2, 0.2), gain=0.28)
        t += rng.uniform(0.055, 0.09)
for k, at in enumerate(EN["tabs"]):
    add(sfx, pitched(TAB[k % 2], rng.uniform(-1, 3) + k * 0.03), sec(at), pan=rng.uniform(-0.7, 0.7), gain=0.2 + 0.0012 * k)

# Score under act 1: a low drone and a minor pad that slowly darkens and tightens.
drone_len = browser_end
add(music, pad([hz("A1"), hz("E2")], drone_len + 0.5, amp=0.11, attack=2.5, release=0.05, bright=500), 0.0)
for k, ch in enumerate([["A2", "C3", "E3"], ["F2", "A2", "C3"], ["D2", "F2", "A2"], ["E2", "G#2", "B2"]]):
    span = sec(EN["from"]) / 4
    add(music, pad([hz(n) for n in ch], span + 1.2, amp=0.07 + 0.012 * k, attack=1.0, release=1.0, bright=900 + 250 * k), k * span)
swell = pad([hz(n) for n in ["A2", "E3", "A3", "C4", "D#4", "A4"]], browser_end - sec(EN["from"]) + 0.02, amp=0.16, attack=0.3, release=0.01, bright=3200)
swell *= np.linspace(0.35, 1.0, len(swell))[:, None] ** 2
add(music, swell, sec(EN["from"]))
# Heartbeat under the spiral.
hb = sec(EN["from"])
gap = 0.62
while hb < browser_end - 0.1:
    add(music, kick(0.45), hb)
    add(music, kick(0.3), hb + 0.16)
    hb += gap
    gap = max(0.34, gap * 0.9)

# Hard cut: total silence on the black card until the line lands.
cut = int(browser_end * SR)
for buf in (music, sfx):
    buf[cut:int(sec(scene("line") + 14) * SR)] = 0

# ---------- The line and the turn ----------
add(music, piano(hz("A2"), dur=3.5, amp=0.22), sec(scene("line")) + 0.55)
add(music, piano(hz("E3"), dur=3.0, amp=0.12), sec(scene("line")) + 0.58)
turn = scene("turn")
N_TABS = 2 + sum(len(s["tabsAt"]) for s in S["searches"]) + len(EN["tabs"])
def ease(t): return 1 - (1 - min(1, max(0, t))) ** 3
prev = N_TABS
for fr in range(0, 50):
    p = ease(min(1, max(0, (fr - 4) / 36)) ** 2)
    keep = max(1, round(N_TABS - (N_TABS - 1) * p))
    closed = prev - keep
    for c in range(min(closed, 2)):
        add(sfx, pitched(TAB_CLOSE[int(rng.integers(3))], rng.uniform(-2, 2)), sec(turn + fr) + c * 0.012, pan=0.6 - 1.2 * fr / 50, gain=0.32)
    prev = keep

# Relief: the first warm chord lands with "focus on your app."
land = sec(turn + 52)
for k, n in enumerate(["C3", "G3", "E4", "B4", "D5"]):
    add(music, piano(hz(n), dur=4.5, amp=0.17), land + k * 0.025, pan=-0.4 + 0.2 * k)
add(music, pad([hz(n) for n in ["C3", "G3", "E4", "B4"]], sec(scene("auth-implementation") - turn - 52) + 0.6, amp=0.06, attack=0.8, release=0.6, bright=2200), land)

# ---------- Act 2: one bar per skill ----------
BAR = S["beat"]["bar"] / FPS
SIX = BAR / 16
prog = {
    "auth-implementation": (["C4", "E4", "G4", "B4"], "C2"),
    "payments-with-dodo": (["A3", "C4", "E4", "G4"], "A1"),
    "mobile-first": (["F3", "A3", "C4", "E4"], "F1"),
    "skills": (["C4", "E4", "G4", "D5"], "C2"),
    "works": (["F3", "A3", "C4", "E4"], "F1"),
}
pattern = [0, 2, 1, 3, 2, 1, 3, 2, 0, 2, 1, 3, 2, 3, 1, 2]
def groove(name, bars_len):
    notes, root = prog[name]
    start = sec(scene(name))
    for b in range(int(np.ceil(bars_len))):
        t0 = start + b * BAR
        add(music, piano(hz(root), dur=BAR * 1.1, amp=0.20), t0)
        add(music, piano(hz(root) * 2, dur=BAR, amp=0.10), t0 + 0.004)
        for st in range(16):
            if (b + st / 16) >= bars_len: break
            add(music, piano(hz(notes[pattern[st]]) * (2 if st in (6, 14) else 1), dur=1.2, amp=0.085 if st % 4 else 0.11), t0 + st * SIX, pan=-0.35 + 0.05 * st)
            if st % 2 == 1: add(music, shaker(0.035), t0 + st * SIX, pan=0.4)
        for beat in (0, 2):
            if b + beat / 4 < bars_len: add(music, kick(0.32), t0 + beat * BAR / 4)
        add(music, pad([hz(n) for n in notes], BAR * min(1, bars_len - b) + 0.4, amp=0.045, attack=0.3, release=0.4, bright=2000), t0)

for name in ["auth-implementation", "payments-with-dodo", "mobile-first", "skills", "works"]:
    groove(name, SC[name]["duration"] / S["beat"]["bar"])

B = S["beat"]
for name in ["auth-implementation", "payments-with-dodo", "mobile-first"]:
    st = scene(name)
    add(sfx, DONE, sec(st + B["wipeAt"] + 9), gain=0.3)

# Launch night: the groove drops out under the question, the verdict lands on a darker chord.
dep = scene("deploy-check")
D = S["deploy"]
add(music, pad([hz("A1"), hz("E2"), hz("A2")], sec(D["blockedAt"]) + 0.02, amp=0.10, attack=0.2, release=0.02, bright=700), sec(dep))
for k in D["keys"]:
    add(sfx, low(key(k["ch"] == " "), 3200), sec(dep + k["t"]), pan=rng.uniform(-0.1, 0.1), gain=0.26)
add(sfx, low(ENTER, 3200), sec(dep + D["enter"]), gain=0.3)
add(sfx, NO, sec(dep + D["blockedAt"]), gain=0.6)
for r, at in enumerate(D["reasonsAt"]):
    add(sfx, pitched(POP, -2 + r), sec(dep + at), pan=-0.2 + 0.2 * r, gain=0.16)
add(music, pad([hz("A1"), hz("E2"), hz("C3")], sec(SC["deploy-check"]["duration"] - D["blockedAt"]) + 0.3, amp=0.07, attack=0.05, release=0.4, bright=900), sec(dep + D["blockedAt"]))

# ---------- Every skill ----------
sk = scene("skills")
for k in range(34):
    add(sfx, pitched(TAB_CLOSE[k % 3], -3 + k * 0.18), sec(sk + 6 + k * 1.1), pan=-0.1 + 0.5 * k / 34, gain=0.16)

# ---------- Works and the end ----------
w = scene("works")
for k in range(3):
    add(sfx, pitched(POP, k * 1.5), sec(w + 14 + k * 7), pan=-0.4 + 0.4 * k, gain=0.32)
e = scene("end")
E = S["end"]
for k, n in enumerate(["C2", "C3", "G3", "E4", "B4", "D5", "G5"]):
    add(music, piano(hz(n), dur=6.5, amp=0.16 if k else 0.22), sec(e + 2) + k * 0.03, pan=-0.45 + 0.15 * k)
add(music, pad([hz(n) for n in ["C3", "G3", "E4", "B4", "D5"]], LEN - sec(e) + 1, amp=0.07, attack=1.0, release=2.5, bright=2400), sec(e))
# Pasted, not typed: one soft paste, then Enter.
add(sfx, low(key(), 3200), sec(e + E["commandAt"]), gain=0.26)
add(sfx, low(ENTER, 3200), sec(e + E["enter"]), gain=0.3)
for k, n in enumerate(["G4", "C5", "E5"]):
    add(music, piano(hz(n), dur=3.5, amp=0.10), sec(e + E["enter"] + 6) + k * 0.05)

# ---------- Mix ----------
music = reverb(music, 2.4, 0.42, tone=4200)
sfx = reverb(sfx, 0.35, 0.10, tone=7000)
# Keep the silences silent after the reverb tails.
for buf in (music, sfx):
    buf[cut:int(sec(scene("line") + 14) * SR)] = 0

def write(buf, name, target):
    n_end = int(LEN * SR)
    fade = int(1.6 * SR)
    buf = buf[:n_end].copy()
    buf[n_end - fade:] *= np.linspace(1, 0, fade)[:, None]
    buf = np.tanh(buf * 1.2) / 1.2
    buf /= max(1e-9, np.abs(buf).max()) / 0.89
    raw = os.path.join(HERE, f"{name}-raw.wav")
    with wave.open(raw, "wb") as wf:
        wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR)
        wf.writeframes((buf * 32767).astype("<i2").tobytes())
    final = os.path.join(ROOT, "public", "audio", f"{name}.wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", f"loudnorm=I={target}:TP=-1.5:LRA=14", "-ar", str(SR), final], check=True)
    os.remove(raw)
    print("wrote", final)

os.makedirs(os.path.join(ROOT, "public", "audio"), exist_ok=True)
write(music, "music", -19)
write(sfx, "sfx", -22.5)
