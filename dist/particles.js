(() => {
  window.PaigeParticles = function(root) {
    const stage = root;
    const wash = root.querySelector('.cp-wash');
    const canvas = root.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const state = { material: 'original', size: 11, blue: 45, energy: 110, count: 5300, opacity: 58, boldness: 0, contrast: 40, reach: 140, affectedPct: 65, auto: true, paused: reducedMotion.matches };
      const originalColors = ['#ffffa1', '#cde5f1', '#d2e4a8'];
      const colors = ['#ffffa1', '#cde5f1', '#d2e4a8'];
      const particles = [];
      const vortices = [];
      const sprites = [];
      const atlases = {};
      let width = 1, height = 1, scale = 1, time = 0, nextBurst = .25;
      let frame = 0, lastTime = 0, visible = true;
      let lastPointer = null, lastEmission = -1e6;
      const materialSizes = { radial: 17, original: 11, dots: 17, bubbles: 17 };
      const materialOpacities = { radial: 100, original: 58, dots: 44, bubbles: 44 };
      const materialNames = { radial: 'Radial dots', original: 'Original colored dots', dots: 'Soft flat dots', bubbles: 'Soft 3D bubbles' };
      const TWO_PI = Math.PI * 2;
      const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
      const mix = (a, b, f) => a.map((v, i) => Math.round(v + (b[i] - v) * f));
      const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
      const rgba = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
      const palette = () => colors.map(rgb);

      function deepenColor(c, amount) {
        const [r, g, b] = c.map(v => v / 255);
        const high = Math.max(r, g, b), low = Math.min(r, g, b), delta = high - low;
        let light = (high + low) / 2, hue = 0, saturation = 0;
        if (delta > 0) {
          saturation = delta / (1 - Math.abs(2 * light - 1));
          hue = high === r ? ((g - b) / delta + (g < b ? 6 : 0)) : high === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
          hue /= 6;
        }
        light = Math.max(.08, light - .4 * amount);
        if (delta > 0) saturation = Math.min(1, saturation + .16 * amount);
        const a = saturation * Math.min(light, 1 - light);
        const channel = n => {
          const k = (n + hue * 12) % 12;
          return Math.round(255 * (light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
        };
        return [channel(0), channel(8), channel(4)];
      }

      function rebuildPalette() {
        const [y, b, g] = palette();
        const blueArea = 50 + (state.blue - 38) * .7;
        const base = mix(mix(y, g, .62), b, state.blue / 100);
        stage.style.background = rgba(base);
        wash.style.background = `radial-gradient(ellipse at 78% 18%, ${rgba(mix(b,[210,235,245],.1))} 0%, ${rgba(b,.92)} 23%, ${rgba(b,0)} ${blueArea + 18}%), radial-gradient(ellipse at 8% 22%, ${rgba(mix(y,[255,246,213],.08))} 0%, ${rgba(y,.98)} 24%, ${rgba(y,0)} 66%), radial-gradient(ellipse at 40% 105%, ${rgba(g)} 0%, ${rgba(g,.9)} 35%, ${rgba(g,0)} 79%), linear-gradient(120deg, ${rgba(y)}, ${rgba(b)} 66%, ${rgba(g)})`;
        sprites.length = 0;
        palette().forEach(c => {
          const set = { radial: [], original: [], dots: [], bubbles: [] };
          const core = deepenColor(c, state.contrast / 100);
          for (let shade = 0; shade < 4; shade++) {
            const radial = document.createElement('canvas');
            radial.width = radial.height = 72;
            const rc = radial.getContext('2d');
            const fade = rc.createRadialGradient(36, 36, 0, 36, 36, 32);
            fade.addColorStop(0, rgba(core, 1));
            fade.addColorStop(.22, rgba(core, 1));
            fade.addColorStop(.48, rgba(mix(core, c, .38), .86));
            fade.addColorStop(.74, rgba(c, .35));
            fade.addColorStop(.93, rgba(c, .06));
            fade.addColorStop(1, rgba(c, 0));
            rc.fillStyle = fade;
            rc.beginPath(); rc.arc(36, 36, 32, 0, TWO_PI); rc.fill();
            set.radial.push(radial);

            const maximum = Math.max(...c);
            const colorful = c.map(v => Math.round(clamp(v - (maximum - v) * .95 - 16, 0, 255)));
            const originalBody = shade === 0 ? mix(c, [255,255,255], .1) : mix(c, colorful, .4 + .16 * shade);
            const original = document.createElement('canvas');
            original.width = original.height = 72;
            const oc = original.getContext('2d');
            oc.fillStyle = rgba(deepenColor(originalBody, state.boldness / 100 * .65));
            oc.beginPath(); oc.arc(36, 36, 32, 0, TWO_PI); oc.fill();
            set.original.push(original);

            const flat = document.createElement('canvas');
            flat.width = flat.height = 72;
            const f = flat.getContext('2d');
            f.fillStyle = rgba(c);
            f.beginPath(); f.arc(36, 36, 32, 0, TWO_PI); f.fill();
            set.dots.push(flat);

            const bubble = document.createElement('canvas');
            bubble.width = bubble.height = 96;
            const bc = bubble.getContext('2d');
            const gradient = bc.createRadialGradient(35, 30, 1, 48, 48, 42);
            gradient.addColorStop(0, rgba(mix(c, [255,255,255], .35), .85));
            gradient.addColorStop(.21, rgba(mix(c, [255,255,255], .12), .8));
            gradient.addColorStop(.55, rgba(c, .82));
            gradient.addColorStop(.86, rgba(mix(c, [7,40,64], .035), .7));
            gradient.addColorStop(1, rgba(c, .25));
            bc.fillStyle = gradient;
            bc.beginPath(); bc.arc(48, 48, 42, 0, TWO_PI); bc.fill();
            const reflection = bc.createRadialGradient(34, 29, 0, 34, 29, 13);
            reflection.addColorStop(0, 'rgba(255,255,255,.24)');
            reflection.addColorStop(1, 'rgba(255,255,255,0)');
            bc.fillStyle = reflection;
            bc.beginPath(); bc.arc(34, 29, 13, 0, TWO_PI); bc.fill();
            set.bubbles.push(bubble);
          }
          sprites.push(set);
        });
        // One image per style lets the renderer batch thousands of dots.
        for (const material of ['original', 'radial', 'dots', 'bubbles']) {
          const side = material === 'bubbles' ? 96 : 72;
          const atlas = document.createElement('canvas');
          atlas.width = side * 4; atlas.height = side * 3;
          const ac = atlas.getContext('2d');
          sprites.forEach((set, color) => set[material].forEach((sprite, shade) => {
            ac.drawImage(sprite, shade * side, color * side);
          }));
          atlases[material] = atlas;
        }
      }

      function colorFor(rank) {
        const blueEnd = state.blue / 100;
        return rank < blueEnd ? 1 : rank < blueEnd + (1 - blueEnd) / 2 ? 0 : 2;
      }

      function createParticle(i) {
        const rank = Math.random();
        const color = colorFor(rank);
        const phase = Math.random() * TWO_PI;
        const driftX = Math.cos(phase) * (2 + Math.random() * 3);
        const driftY = Math.sin(phase) * (2 + Math.random() * 3);
        return { x: Math.random() * width, y: Math.random() * height,
          vx: driftX, vy: driftY, driftX, driftY, rank, color,
          size: Math.pow(Math.random(), .78), depth: .55 + Math.random() * .45,
          phase, shade: i % 4, alpha: .66 + Math.random() * .34,
          swirl: null };
      }

      function syncParticles() {
        while (particles.length < state.count) particles.push(createParticle(particles.length));
        particles.length = state.count;


      }

      function resize() {
        const bounds = stage.getBoundingClientRect();
        if (bounds.width < 1) return;
        const oldW = width, oldH = height;
        width = bounds.width; height = bounds.height;
        scale = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        particles.forEach(p => { p.x *= width / oldW; p.y *= height / oldH; });
        if (oldW !== width || oldH !== height) {
          clearVortices();
        }
        syncParticles(); draw();
      }

      function releaseVortex(v) {
        v.members.forEach(p => { if (p.swirl === v) p.swirl = null; });
      }

      function clearVortices() {
        vortices.forEach(releaseVortex);
        vortices.length = 0;
      }

      function addVortex(x, y, power = 1.5, direction, reactive = true) {
        const radius = state.reach * (.6 + Math.random() * .6);
        const radius2 = radius * radius;
        const candidates = [];
        for (const p of particles) {
          const dx = p.x - x, dy = p.y - y;
          if (dx * dx + dy * dy < radius2) candidates.push(p);
        }
        const amount = Math.round(candidates.length * state.affectedPct / 100);
        if (!amount) return;
        const v = { x, y, age: 0, life: 1.05 + radius / 200,
          direction: direction || (Math.random() > .5 ? 1 : -1),
          power, radius, reactive, nearbyCount: candidates.length,
          speed: radius / (reactive ? .5 : .85), members: [] };
        for (let i = 0; i < amount; i++) {
          const index = i + Math.floor(Math.random() * (candidates.length - i));
          [candidates[i], candidates[index]] = [candidates[index], candidates[i]];
          const p = candidates[i];
          // Each dot follows one wave at a time, even where swirls overlap.
          p.swirl = v;
          v.members.push(p);
          const dx = p.x - x, dy = p.y - y;
          const distance = Math.hypot(dx, dy) + .01;
          const falloff = reactive ? Math.max(0, 1 - distance * distance / radius2) : Math.exp(-4 * distance * distance / radius2);
          const kick = (reactive ? 34 : 10) * falloff * power * state.energy / 100;
          p.vx += (-dy * v.direction + dx * .12) / distance * kick;
          p.vy += (dx * v.direction + dy * .12) / distance * kick;
        }
        if (vortices.length >= 16) releaseVortex(vortices.shift());
        vortices.push(v);
      }

      function step(dt) {
        time += dt;
        if (state.auto && time >= nextBurst) {
          addVortex(width * (.12 + Math.random() * .76), height * (.15 + Math.random() * .7));
          nextBurst = time + .65 + Math.random() * .55;
        }
        const strength = state.energy / 100;
        const damping = Math.exp(-1.85 * dt);
        for (const p of particles) {
          const desiredX = p.driftX + Math.sin(time * .23 + p.phase) * 1.5;
          const desiredY = p.driftY + Math.cos(time * .19 + p.phase) * 1.5;
          p.vx = desiredX + (p.vx - desiredX) * damping;
          p.vy = desiredY + (p.vy - desiredY) * damping;
        }
        for (let i = vortices.length - 1; i >= 0; i--) {
          const v = vortices[i];
          v.age += dt;
          if (v.age > v.life) { releaseVortex(v); vortices.splice(i, 1); continue; }
          const front = 8 + v.age * v.speed;
          const band = 9 + v.radius * .12;
          const envelope = (.65 + .35 * Math.min(1, v.age / .06)) * Math.max(0, 1 - v.age / v.life);
          for (const p of v.members) {
            if (p.swirl !== v) continue;
            const dx = p.x - v.x, dy = p.y - v.y;
            const d2 = dx * dx + dy * dy;
            if (d2 >= v.radius * v.radius) continue;
            const distance = Math.sqrt(d2) + .01;
            const bandWeight = Math.exp(-1.5 * ((distance - front) / band) ** 2);
            const coreWeight = Math.exp(-d2 / (v.radius * (v.reactive ? .5 : .34)) ** 2) * Math.exp(-v.age * (v.reactive ? 4 : 5)) * (v.reactive ? .8 : .6);
            const edge = Math.max(0, 1 - (distance / v.radius) ** 4);
            const force = (bandWeight + coreWeight) * envelope * edge * v.power * strength * p.depth;
            const nx = dx / distance, ny = dy / distance;
            const turn = v.reactive ? 300 : 235;
            p.vx += (-ny * v.direction * turn + nx * 22) * force * dt;
            p.vy += (nx * v.direction * turn + ny * 22) * force * dt;
          }
        }
        for (const p of particles) {
          const speed2 = p.vx * p.vx + p.vy * p.vy;
          if (speed2 > 160 * 160) { const limit = 160 / Math.sqrt(speed2); p.vx *= limit; p.vy *= limit; }
          p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.x < 0) p.x += width;
          else if (p.x >= width) p.x -= width;
          if (p.y < 0) p.y += height;
          else if (p.y >= height) p.y -= height;
        }
      }

      function draw() {
        ctx.clearRect(0, 0, width, height);
        const atlas = atlases[state.material];
        const side = state.material === 'bubbles' ? 96 : 72;
        const pad = state.material === 'bubbles' ? 96 / 84 : 72 / 64;
        for (const p of particles) {
          const diameter = 1 + p.size * (state.size - 1);
          const size = diameter * pad;
          const originalAlpha = .52 + (p.alpha - .66) / .34 * .4;
          const boldAlpha = originalAlpha + (1 - originalAlpha) * state.boldness / 100;
          const opacityVariation = state.material === 'radial' ? 1 : state.material === 'original' ? boldAlpha : p.alpha;
          ctx.globalAlpha = opacityVariation * state.opacity / 100;
          ctx.drawImage(atlas, p.shade * side, p.color * side, side, side, p.x - size / 2, p.y - size / 2, size, size);
        }
        ctx.globalAlpha = 1;
      }

      let active = false;
      function loop(now) {
        frame = 0;
        if (!root.isConnected) { observer.disconnect(); intersection.disconnect(); return; }
        if (!active || state.paused || !visible || document.hidden) { lastTime = 0; return; }
        const dt = lastTime ? Math.min(.04, (now - lastTime) / 1000) : 1 / 60;
        lastTime = now;
        step(dt); draw();
        frame = requestAnimationFrame(loop);
      }
      function start() {
        if (!frame && active && !state.paused && visible && !document.hidden) frame = requestAnimationFrame(loop);
      }
      function setActive(value) {
        active = value;
        wash.style.animationPlayState = active && !state.paused && visible ? 'running' : 'paused';
        if (!active) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
        else start();
      }
      function pointerPosition(e) {
        const bounds = canvas.getBoundingClientRect();
        return { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
      }
      canvas.addEventListener('pointermove', e => {
        if (state.paused || !active) return;
        const p = pointerPosition(e);
        const moved = lastPointer ? Math.hypot(p.x - lastPointer.x, p.y - lastPointer.y) : 100;
        const now = performance.now();
        if (moved > 3 && now - lastEmission > 32) {
          const direction = lastPointer && p.x < lastPointer.x ? -1 : 1;
          const power = 1.2 + Math.min(.75, moved / Math.max(16, now - lastEmission) * .5);
          addVortex(p.x, p.y, power, direction, true);
          lastEmission = now; lastPointer = p;
        }
      });
      canvas.addEventListener('pointerdown', e => {
        if (state.paused || !active) return;
        const p = pointerPosition(e);
        addVortex(p.x, p.y);
        lastEmission = performance.now(); lastPointer = p;
      });
      canvas.addEventListener('pointerleave', () => { lastPointer = null; });
      document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
      reducedMotion.addEventListener('change', e => {
        state.paused = e.matches;
        setActive(active);
      });
      const observer = new ResizeObserver(resize);
      const intersection = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        setActive(active);
      });
      rebuildPalette(); resize();
      observer.observe(stage); intersection.observe(root);
      setActive(false);
      return { setActive, setPaused(value) { state.paused=value; setActive(active); draw(); } };
    };
  })();
