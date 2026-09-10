import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Original illustrative geometry with isolated sample content.
// The renderer never reads a visitor's saved work.
function pageTexture(side, tone = 'white', ink = 'carbon', grid = 'dots', perspective = 'daily') {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2560;
  const c = canvas.getContext('2d');
  c.scale(2, 2);
  const color = {
    carbon: '#101010',
    blue: '#264b73',
    burgundy: '#71383f'
  }[ink];
  c.fillStyle = {
    ivory: '#f3f0e6',
    white: '#ffffff',
    slate: '#e4e6e4'
  }[tone];
  c.fillRect(0, 0, 1024, 1280);
  c.fillStyle = '#52504b22';
  c.strokeStyle = '#52504b13';
  c.lineWidth = 1;
  for (let x = 32; x < 1024; x += 32) for (let y = 32; y < 1280; y += 32) {
    if (grid === 'dots') {
      c.beginPath();
      c.arc(x, y, 1.1, 0, Math.PI * 2);
      c.fill();
    }
  }
  if (grid === 'square') for (let n = 32; n < 1280; n += 32) {
    c.beginPath();
    c.moveTo(n, 0);
    c.lineTo(n, 1280);
    c.moveTo(0, n);
    c.lineTo(1024, n);
    c.stroke();
  }
  const text = (s, x, y, size = 24, weight = 400, fill = color) => {
    c.fillStyle = fill;
    c.font = `${weight} ${size}px Helvetica, Arial, sans-serif`;
    c.fillText(s, x, y);
  };
  const line = y => {
    c.strokeStyle = '#39382f30';
    c.beginPath();
    c.moveTo(88, y);
    c.lineTo(936, y);
    c.stroke();
  };
  text('P R I M A C Y', 88, 100, 22, 700);
  text(`${perspective.charAt(0).toUpperCase() + perspective.slice(1)} / ${side === 'left' ? '01' : '02'}`, 762, 100, 18, 500);
  line(132);
  if (perspective === 'monthly') {
    if (side === 'left') {
      text('September', 88, 238, 68, 500);
      text('Make space for what matters.', 88, 304, 29, 400);
      text('A month of meaningful progress.', 88, 356, 22, 400, '#686868');
      const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      labels.forEach((label, col) => text(label, 117 + col * 118, 438, 20, 600));
      for (let row = 0; row < 5; row++) {
        line(465 + row * 122);
        for (let col = 0; col < 7; col++) {
          const day = row * 7 + col;
          if (day > 0 && day <= 30) {
            const x = 115 + col * 118, y = 505 + row * 122;
            if ([3, 7, 10, 15, 21, 24].includes(day)) {
              c.fillStyle = '#141414'; c.beginPath(); c.arc(x + 9, y - 8, 24, 0, Math.PI * 2); c.fill();
            }
            text(String(day), x, y, 23, 500, [3, 7, 10, 15, 21, 24].includes(day) ? '#ffffff' : color);
          }
        }
      }
      text('A little consistency adds up.', 88, 1140, 27, 500);
    } else {
      text('Your month,', 88, 238, 62, 500);
      text('in perspective.', 88, 306, 62, 500);
      text('Notice the pattern. Choose your next step.', 88, 362, 24);
      text('The Outcomes That Matter', 88, 456, 24, 600); line(488);
      [['Finish the first prototype', 'A clear, usable starting point.'], ['Protect focused mornings', 'Make room for the work that needs you.'], ['Keep movement consistent', 'Small actions, repeated with intention.']].forEach(([title, detail], i) => {
        text(String(i + 1).padStart(2, '0'), 88, 559 + i * 117, 24, 600);
        text(title, 145, 557 + i * 117, 30, 500);
        text(detail, 145, 599 + i * 117, 22, 400, '#666666');
        line(625 + i * 117);
      });
      text('What Will You Carry Forward?', 88, 955, 26, 600);
      text('Fewer commitments. More follow-through.', 88, 1024, 29);
      line(1064); line(1136);
    }
  } else if (perspective === 'yearly') {
    if (side === 'left') {
      text('2026', 88, 263, 128, 500);
      text('A direction worth returning to.', 88, 343, 33, 400);
      text('The Bigger Picture', 88, 445, 24, 600); line(477);
      text('Build work I am proud of.', 88, 557, 38, 500);
      text('Make time for the life around it.', 88, 612, 32);
      ['Create with intention', 'Learn something that lasts', 'Be present, more often'].forEach((item, i) => {
        const y = 732 + i * 123;
        text('0' + (i + 1), 88, y, 22, 600, '#777777');
        text(item, 155, y, 31, 500); line(y + 43);
      });
      text('Your direction can evolve with you.', 88, 1128, 24, 400, '#666666');
    } else {
      text('Small steps.', 88, 238, 64, 500);
      text('A longer view.', 88, 306, 64, 500);
      text('Give each season a clear purpose.', 88, 368, 27);
      [['Q1', 'Lay The Foundation', 'Choose the work. Build a rhythm.'], ['Q2', 'Make It Real', 'Turn a promising idea into a first version.'], ['Q3', 'Refine And Grow', 'Notice what works. Improve it.'], ['Q4', 'Reflect And Renew', 'Keep the lessons. Set a new direction.']].forEach(([quarter, title, detail], i) => {
        const y = 490 + i * 155;
        c.fillStyle = '#141414'; c.fillRect(88, y - 29, 65, 51);
        text(quarter, 101, y + 4, 24, 600, '#ffffff');
        text(title, 185, y, 31, 500);
        text(detail, 185, y + 48, 22, 400, '#666666'); line(y + 87);
      });
    }
  } else if (side === 'left') {
    text('Monday,', 88, 237, 58, 500);
    text('a fresh perspective.', 88, 303, 54, 500);
    text('SEPTEMBER 07, 2026', 88, 360, 18, 500, '#666666');
    text('THE THREE THAT MATTER', 88, 454, 20, 700);
    line(482);
    ['Create something meaningful.', 'Make space for deep work.', 'Be present for the people I love.'].forEach((s, i) => {
      const y = 553 + i * 95;
      c.strokeStyle = i === 0 ? '#161616' : '#555555';
      c.lineWidth = 2;
      c.strokeRect(92, y - 22, 23, 23);
      if (!i) text('✓', 92, y, 26, 400, '#161616');
      text(s, 139, y, 32, 500, i === 0 ? '#666666' : color);
      line(y + 36);
    });
    text('ROOM FOR EVERYTHING ELSE', 88, 882, 20, 700);
    ['•  An idea worth coming back to', '—  Less urgency. More intention.', '•  Walk without my phone'].forEach((s, i) => text(s, 92, 953 + i * 64, 23));
  } else {
    text('Small rituals.', 88, 237, 58, 500);
    text('Lasting change.', 88, 303, 58, 500);
    text('A LITTLE BETTER, EVERY DAY.', 88, 360, 18, 500, '#666666');
    text('THE THINGS I RETURN TO', 88, 454, 20, 700);
    line(482);
    ['M', 'T', 'W', 'T', 'F'].forEach((s, i) => text(s, 617 + i * 65, 530, 16, 500));
    ['Read a few pages', 'Move my body', 'One quiet moment'].forEach((s, row) => {
      const y = 597 + row * 77;
      text(s, 88, y, 30);
      for (let i = 0; i < 5; i++) {
        c.beginPath();
        c.arc(626 + i * 65, y - 8, 11, 0, Math.PI * 2);
        c.fillStyle = i <= 3 - row ? '#171717' : '#dddddd';
        c.fill();
      }
      line(y + 29);
    });
    text('A MOMENT TO REFLECT', 88, 882, 20, 700);
    text('What made today worthwhile?', 88, 946, 27, 500);
    text('An unhurried conversation. A clear mind.', 88, 1003, 23);
    line(1040);
    text('Enough space to notice the good.', 88, 1080, 23);
    line(1114);
  }
  line(1185);
  text('YOUR DAY. BY DESIGN.', 88, 1230, 16, 500, '#686868');
  const fold = c.createLinearGradient(side === 'left' ? 900 : 0, 0, side === 'left' ? 1024 : 124, 0);
  fold.addColorStop(0, side === 'left' ? '#00000000' : '#00000024');
  fold.addColorStop(1, side === 'left' ? '#00000024' : '#00000000');
  c.fillStyle = fold;
  c.fillRect(side === 'left' ? 900 : 0, 0, 124, 1280);
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 16;
  return t;
}
function grainTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const pixels = ctx.createImageData(256, 256);
  let seed = 19;
  for (let i = 0; i < pixels.data.length; i += 4) {
    seed = seed * 16807 % 2147483647;
    const v = 90 + seed % 85;
    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = v;
    pixels.data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(5, 6);
  return t;
}
function buildBook(textures, grain, finish) {
  const root = new THREE.Group();
  const coverMat = new THREE.MeshStandardMaterial({
    color: finish,
    roughness: 0.65,
    metalness: 0.15,
    bumpMap: grain,
    bumpScale: 0.025
  });
  const edgeMat = new THREE.MeshStandardMaterial({
    color: '#e9e9e9',
    roughness: 0.95
  });
  const parts = [];
  [-1, 1].forEach((side, index) => {
    const group = new THREE.Group();
    root.add(group);
    group.rotation.y = side * 0.028;
    const x = side * 1.585;
    const cover = new THREE.Mesh(new RoundedBoxGeometry(3.19, 4.08, 0.13, 6, 0.065), coverMat);
    cover.position.set(x, 0, -0.25);
    group.add(cover);
    const pages = new THREE.Mesh(new RoundedBoxGeometry(3.09, 3.97, 0.28, 5, 0.04), edgeMat);
    pages.position.set(x, 0, -0.06);
    group.add(pages);
    // Individual leaves catch grazing light along the fore-edge.
    const leafMat = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.9
    });
    for (let n = 0; n < 52; n++) {
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(3.08, 0.008, 0.003), leafMat);
      leaf.position.set(x, -1.982, -0.193 + n * 0.0052);
      group.add(leaf);
      const edge = new THREE.Mesh(new THREE.BoxGeometry(0.006, 3.93, 0.003), leafMat);
      edge.position.set(x + side * 1.54, 0, -0.193 + n * 0.0052);
      group.add(edge);
    }
    const geo = new THREE.PlaneGeometry(3.08, 3.95, 128, 40);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = (pos.getX(i) + 1.54) / 3.08;
      const inner = side === -1 ? u : 1 - u;
      pos.setZ(i, 0.105 + Math.sin(u * Math.PI) * 0.09 - Math.pow(inner, 9) * 0.065 + Math.sin(pos.getY(i) * 2.5) * 0.004 * (1 - inner));
    }
    geo.computeVertexNormals();
    const page = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: textures[index], side: THREE.DoubleSide, toneMapped: false }));
    page.position.x = x;
    group.add(page);
    parts.push(page);
  });
  const threadMaterial = new THREE.MeshStandardMaterial({ color: '#dedede', roughness: 0.95 });
  for (let n = 0; n < 18; n++) {
    const y = -1.8 + n * 0.21;
    const path = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.034, y, 0.078), new THREE.Vector3(0, y + 0.025, 0.092), new THREE.Vector3(0.034, y, 0.078)]);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(path, 10, 0.004, 5, false), threadMaterial));
  }
  const ribbon = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 4.36, 1, 30), new THREE.MeshStandardMaterial({
    color: '#292929',
    metalness: 0.38,
    roughness: 0.55,
    side: THREE.DoubleSide
  }));
  const rp = ribbon.geometry.attributes.position;
  for (let i = 0; i < rp.count; i++) {
    const y = rp.getY(i);
    rp.setZ(i, 0.105 + (y < -1.75 ? Math.sin((y + 1.75) * 3) * 0.23 : 0));
  }
  ribbon.geometry.computeVertexNormals();
  ribbon.position.set(0.045, -0.2, 0.01);
  root.add(ribbon);
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 512;
  labelCanvas.height = 128;
  const c = labelCanvas.getContext('2d');
  c.fillStyle = '#151616';
  c.fillRect(0, 0, 512, 128);
  c.strokeStyle = '#ffffff17';
  for (let y = 0; y < 128; y += 3) {
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(512, y);
    c.stroke();
  }
  c.fillStyle = '#ffffff';
  c.font = '600 48px Helvetica';
  c.textAlign = 'center';
  c.fillText('P R I M A C Y', 256, 84);
  // Fine cross-weave and perimeter stitches read under grazing light.
  c.strokeStyle = '#ffffff16';
  for (let x = 0; x < 512; x += 3) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 22, 128); c.stroke(); }
  c.strokeStyle = '#cccccc77'; c.lineWidth = 1; c.setLineDash([3, 4]); c.strokeRect(7, 7, 498, 114);
  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  labelTexture.colorSpace = THREE.SRGBColorSpace;
  const label = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.3, 0.025), new THREE.MeshStandardMaterial({
    map: labelTexture,
    roughness: 1
  }));
  label.position.set(0, 2.08, 0.075);
  root.add(label);
  return {
    root,
    coverMat,
    pages: parts,
    extraTextures: [labelTexture],
    updateTextures: next => parts.forEach((page, i) => { page.material.map = next[i]; page.material.needsUpdate = true; })
  };
}
function roundedPlane(w, h, radius) {
  const shape = new THREE.Shape();
  const x = -w / 2, y = -h / 2, r = radius;
  shape.moveTo(x + r, y); shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r); shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h); shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r); shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  const geo = new THREE.ShapeGeometry(shape, 16);
  const pos = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  return geo;
}
function deviceTexture(kind, textures) {
  const phone = kind === 'mobile';
  const canvas = document.createElement('canvas');
  canvas.width = phone ? 1024 : 3072; canvas.height = phone ? 2176 : 1920;
  const c = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
  c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h);
  c.fillStyle = '#101010'; c.textAlign = 'center';
  c.font = `600 ${phone ? 42 : 48}px Helvetica, Arial, sans-serif`;
  c.fillText('P R I M A C Y', w / 2, phone ? 136 : 116);
  c.font = `400 ${phone ? 25 : 30}px Helvetica, Arial, sans-serif`;
  const labels = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
  labels.forEach((label, i) => c.fillText(label, w / 2 + (i - 1.5) * (phone ? 188 : 190), phone ? 209 : 184));
  c.strokeStyle = '#d4d4d4'; c.beginPath(); c.moveTo(w * .075, phone ? 245 : 220); c.lineTo(w * .925, phone ? 245 : 220); c.stroke();
  const top = phone ? 268 : 254, ph = h - top - 50;
  if (phone) {
    const pw = w - 50;
    c.drawImage(textures[0].image, 25, top, pw, pw * 1.25);
    c.fillStyle = '#f4f4f4'; c.fillRect(76, h - 320, w - 152, 190);
    c.fillStyle = '#111111'; c.font = '500 29px Helvetica'; c.textAlign = 'left';
    c.fillText('A Clear Next Step', 110, h - 253);
    c.font = '400 26px Helvetica'; c.fillText('Keep what matters in view.', 110, h - 196);
  } else {
    const pw = ph / 1.25, start = (w - pw * 2) / 2;
    c.drawImage(textures[0].image, start, top, pw, ph);
    c.drawImage(textures[1].image, start + pw, top, pw, ph);
    c.fillStyle = '#0000000d'; c.fillRect(w / 2 - 1, top + 15, 2, ph - 30);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 16;
  return texture;
}
function buildDevice(kind, textures) {
  const root = new THREE.Group();
  const laptop = kind === 'desktop', phone = kind === 'mobile';
  const metal = new THREE.MeshPhysicalMaterial({ color: '#787b7e', metalness: 0.92, roughness: 0.28, clearcoat: 0.12 });
  const edgeMetal = new THREE.MeshStandardMaterial({ color: '#c0c1c2', metalness: 0.92, roughness: 0.2 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: '#383a3c', metalness: 0.75, roughness: 0.28 });
  const black = new THREE.MeshStandardMaterial({ color: '#060606', metalness: 0.12, roughness: 0.35 });
  const glass = new THREE.MeshPhysicalMaterial({ color: '#090d13', metalness: .55, roughness: .12, clearcoat: 1 });
  const w = laptop ? 6.35 : phone ? 2.22 : 5.3;
  const h = laptop ? 4.08 : phone ? 4.6 : 3.95;
  const depth = phone ? .19 : laptop ? .105 : .105;
  const display = new THREE.Group(); root.add(display);
  const box = (parent, sx, sy, sz, material, x = 0, y = 0, z = 0, r = .035) => {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(sx, sy, sz, 5, Math.min(r, sz / 2, sx / 2, sy / 2)), material);
    mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  };
  // Layered aluminum enclosure and polished chamfer surround the glass.
  box(display, w, h, depth, metal, 0, 0, 0, phone ? .21 : .11);
  const edge = new THREE.Mesh(roundedPlane(w - .025, h - .025, phone ? .23 : .13), edgeMetal);
  edge.position.z = depth / 2 + .001; display.add(edge);
  const bezel = new THREE.Mesh(roundedPlane(w - .06, h - .06, phone ? .22 : .12), black);
  bezel.position.z = depth / 2 + .004; display.add(bezel);
  let texture = deviceTexture(kind, textures);
  const screen = new THREE.Mesh(roundedPlane(w - (phone ? .15 : .23), h - (phone ? .17 : .24), phone ? .19 : .065), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
  screen.position.z = depth / 2 + .01; display.add(screen);
  const addLens = (parent, x, y, z, radius = .026) => {
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(radius * 1.25, radius * 1.25, .015, 32), darkMetal);
    barrel.rotation.x = Math.PI / 2; barrel.position.set(x, y, z); parent.add(barrel);
    const lens = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 12), glass);
    lens.scale.z = .26; lens.position.set(x, y, z + .012); parent.add(lens);
    const reflection = new THREE.Mesh(new THREE.SphereGeometry(radius * .27, 12, 8), new THREE.MeshBasicMaterial({color:'#768493'}));
    reflection.scale.z = .12; reflection.position.set(x - radius * .25, y + radius * .25, z + .02); parent.add(reflection);
  };
  if (phone) {
    const island = new THREE.Mesh(roundedPlane(.6, .16, .08), black); island.position.set(0, h / 2 - .23, .118); display.add(island);
    addLens(display, .205, h / 2 - .23, .125, .034);
    const home = new THREE.Mesh(roundedPlane(.65, .032, .016), black); home.position.set(0, -h / 2 + .18, .118); display.add(home);
    box(display, .032, .44, .068, edgeMetal, w / 2, .55, 0, .012);
    box(display, .032, .24, .068, edgeMetal, -w / 2, 1.13, 0, .012);
    box(display, .032, .32, .068, edgeMetal, -w / 2, .62, 0, .012);
    box(display, .032, .32, .068, edgeMetal, -w / 2, .17, 0, .012);
    // Back camera plateau and three glass optics remain present when rotating.
    box(display, .93, 1.03, .12, metal, -.48, 1.53, -.14, .09);
    [[-.7, 1.8], [-.7, 1.29], [-.26, 1.55]].forEach(([x, y]) => {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(.175, .175, .07, 40), darkMetal);
      ring.rotation.x = Math.PI / 2; ring.position.set(x, y, -.235); display.add(ring);
      const lens = new THREE.Mesh(new THREE.SphereGeometry(.137, 32, 16), glass);
      lens.scale.z = .16; lens.position.set(x, y, -.275); display.add(lens);
    });
    [-1, 1].forEach(side => [-1.6, 1.6].forEach(y => box(display, .009, .025, depth + .002, black, side * w / 2, y, 0, .004)));
  } else if (!laptop) {
    addLens(display, 0, h / 2 - .059, .068, .025);
    box(display, .03, .33, .043, edgeMetal, -w / 2, 1.15, 0, .01);
    box(display, .28, .025, .043, edgeMetal, w / 2 - .42, h / 2, 0, .01);
    box(display, .62, .62, .09, darkMetal, -w / 2 + .47, h / 2 - .47, -.09, .05);
    const backLens = new THREE.Mesh(new THREE.CylinderGeometry(.19, .19, .055, 40), glass);
    backLens.rotation.x = Math.PI / 2; backLens.position.set(-w / 2 + .47, h / 2 - .47, -.165); display.add(backLens);
  }
  if (laptop) {
    const notch = new THREE.Mesh(roundedPlane(.58, .16, .035), black); notch.position.set(0, h / 2 - .14, .071); display.add(notch);
    addLens(display, 0, h / 2 - .13, .077, .025);
    display.position.y = .66; display.rotation.x = -.11;
    const base = box(root, 6.48, .18, 3.66, metal, 0, -1.405, 1.46, .085);
    box(root, 6.43, .012, 3.61, edgeMetal, 0, -1.31, 1.46, .005);
    // Display hinge, recessed keyboard well, sculpted keycaps and legends.
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(.087, .087, 5.38, 32), darkMetal);
    hinge.rotation.z = Math.PI / 2; hinge.position.set(0, -1.31, -.27); root.add(hinge);
    box(root, 5.14, .022, 1.91, black, 0, -1.291, .91, .01);
    const keyMat = new THREE.MeshStandardMaterial({ color: '#101010', roughness: .7 });
    const letters = ['1234567890−=', 'QWERTYUIOP[]', 'ASDFGHJKL;\'↵', 'ZXCVBNM,./↑'];
    const keyCanvas = document.createElement('canvas'); keyCanvas.width = 1024; keyCanvas.height = 512;
    const kc = keyCanvas.getContext('2d'); kc.fillStyle = '#111111'; kc.fillRect(0, 0, 1024, 512); kc.fillStyle = '#eeeeee'; kc.font = '18px Helvetica'; kc.textAlign = 'center';
    letters.forEach((row, r) => [...row].forEach((letter, col) => kc.fillText(letter, col * 80 + 40, r * 110 + 67)));
    const legendTexture = new THREE.CanvasTexture(keyCanvas); legendTexture.colorSpace = THREE.SRGBColorSpace; legendTexture.anisotropy = 16;
    for (let row = 0; row < 5; row++) for (let col = 0; col < 13; col++) {
      const key = box(root, .354, .028, row === 0 ? .19 : .29, keyMat, (col - 6) * .385, -1.264, .14 + row * .335, .013);
      if (row > 0 && col < 12) {
        const geo = new THREE.PlaneGeometry(.354, .29);
        const uv = geo.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, (col * 80 + uv.getX(i) * 80) / 1024, 1 - ((row - 1) * 110 + (1 - uv.getY(i)) * 110) / 512);
        const legend = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: legendTexture, toneMapped: false }));
        legend.rotation.x = -Math.PI / 2; legend.position.set(key.position.x, -1.248, key.position.z); root.add(legend);
      }
    }
    box(root, 2.07, .028, .255, keyMat, 0, -1.264, 1.81, .013);
    [-1, 1].forEach(side => [1.3, 1.71, 2.12].forEach(x => box(root, .35, .028, .255, keyMat, x * side, -1.264, 1.81, .013)));
    box(root, 2.75, .009, 1.03, darkMetal, 0, -1.296, 2.59, .004);
    box(root, 2.725, .012, 1.005, metal, 0, -1.287, 2.59, .005);
    // Perforated stereo speaker arrays use one instanced draw call.
    const holes = new THREE.InstancedMesh(new THREE.CircleGeometry(.009, 6), black, 2 * 7 * 49);
    const matrix = new THREE.Matrix4(), rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    let n = 0;
    [-1, 1].forEach(side => { for (let x = 0; x < 7; x++) for (let z = 0; z < 49; z++) {
      matrix.compose(new THREE.Vector3(side * (2.71 + x * .04), -1.285, .0 + z * .041), rotation, new THREE.Vector3(1, 1, 1)); holes.setMatrixAt(n++, matrix);
    }}); root.add(holes);
    // Ports, lid-opening scallop, and indicator machining.
    [-1, 1].forEach(side => [.15, .63, 1.13].forEach(z => box(root, .012, .054, .18, black, side * 3.238, -1.405, z, .006)));
    box(root, .85, .048, .017, darkMetal, 0, -1.385, 3.29, .008);
    const extras = [legendTexture];
    root.userData.extraTextures = extras;
  }
  if (!laptop) {
    const port = box(display, .32, .012, .07, black, 0, -h / 2, 0, .005);
    for (let i = 0; i < (phone ? 5 : 10); i++) [-1, 1].forEach(side => {
      const aperture = new THREE.Mesh(new THREE.SphereGeometry(.016, 8, 6), black);
      aperture.scale.y = .3; aperture.position.set(side * (.35 + i * .071), -h / 2, 0); display.add(aperture);
    });
  }
  const extras = [texture, ...(root.userData.extraTextures || [])];
  return {
    root, pages: [], extraTextures: extras,
    updateTextures: next => {
      const replacement = deviceTexture(kind, next);
      screen.material.map = replacement; screen.material.needsUpdate = true;
      const at = extras.indexOf(texture); extras[at] = replacement; texture.dispose(); texture = replacement;
    }
  };
}
export default function JournalScene({
  kind = 'journal',
  finish = '#161616',
  tone = 'white',
  ink = 'carbon',
  grid = 'dots',
  perspective = 'daily',
  viewpoint = 'angled',
  paused = false,
  exploded = false,
  className = ''
}) {
  const host = useRef(null);
  const controls = useRef({
    paused,
    exploded,
    perspective,
    viewpoint
  });
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    controls.current = {
      paused,
      exploded,
      perspective,
      viewpoint
    };
  }, [paused, exploded, perspective, viewpoint]);
  useEffect(() => {
    const el = host.current;
    let cancelled = false;
    let cleanup = () => {};
    const init = () => {
      if (cancelled) return;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        });
      } catch {
        setFailed(true);
        return;
      }
      setFailed(false);
      renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio, 1.5), 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.88;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      el.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const env = pmrem.fromScene(room, 0.04);
      scene.environment = env.texture;
      room.dispose();
      pmrem.dispose();
      scene.add(new THREE.HemisphereLight('#ffffff', '#333333', 0.85));
      const key = new THREE.DirectionalLight('#ffffff', 1.6);
      key.position.set(-3, 5, 7);
      scene.add(key);
      const rim = new THREE.DirectionalLight('#ffffff', 1.35);
      rim.position.set(5, 1, -2);
      scene.add(rim);
      let textures = [pageTexture('left', tone, ink, grid, controls.current.perspective), pageTexture('right', tone, ink, grid, controls.current.perspective)];
      let renderedPerspective = controls.current.perspective;
      let renderedViewpoint = controls.current.viewpoint;
      const grain = grainTexture();
      const model = kind === 'journal' ? buildBook(textures, grain, finish) : buildDevice(kind, textures);
      scene.add(model.root);
      model.root.rotation.set(kind === 'journal' ? -0.57 : 0.1, -0.1, -0.04);
      const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 80);
      camera.position.set(0, 0.5, 12.4);
      camera.lookAt(0, 0, 0);
      let width = 1, height = 1, fittedZ = 12.4;
      const resize = () => {
        width = el.clientWidth;
        height = el.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(height, 1);
        fittedZ = Math.max(kind === 'desktop' ? 11 : kind === 'mobile' ? 9.5 : 8.7, (kind === 'mobile' ? 5.1 : 12.3) / camera.aspect);
        camera.position.z = fittedZ;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();
      let active = true;
      const visibility = new IntersectionObserver(([entry]) => {
        active = entry.isIntersecting;
      });
      visibility.observe(el);
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      let reduced = media.matches;
      const motionChange = e => {
        reduced = e.matches;
      };
      media.addEventListener('change', motionChange);
      let velocityX = 0, velocityY = 0;
      let targetX = 0,
        targetY = 0,
        drag = false,
        lastX = 0,
        lastY = 0;
      const down = e => {
        if (e.pointerType === 'touch') return;
        drag = true;
        velocityX = velocityY = 0;
        lastX = e.clientX;
        lastY = e.clientY;
        el.setPointerCapture(e.pointerId);
      };
      const move = e => {
        if (!drag) return;
        velocityY = (e.clientX - lastX) * 0.0025;
        velocityX = (e.clientY - lastY) * 0.002;
        targetY = THREE.MathUtils.clamp(targetY + velocityY, -0.65, 0.65);
        targetX = THREE.MathUtils.clamp(targetX + velocityX, -0.24, 0.45);
        lastX = e.clientX;
        lastY = e.clientY;
      };
      const up = () => {
        drag = false;
      };
      const keydown = e => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(e.key)) return;
        e.preventDefault();
        if (e.key === 'Home') {
          targetX = targetY = 0;
        } else {
          targetY = THREE.MathUtils.clamp(targetY + (e.key === 'ArrowLeft' ? -0.1 : e.key === 'ArrowRight' ? 0.1 : 0), -0.65, 0.65);
          targetX = THREE.MathUtils.clamp(targetX + (e.key === 'ArrowUp' ? -0.1 : e.key === 'ArrowDown' ? 0.1 : 0), -0.24, 0.45);
        }
      };
      el.addEventListener('pointerdown', down);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
      el.addEventListener('keydown', keydown);
      let frame;
      let time = 0,
        previous = 0;
      const animate = now => {
        frame = requestAnimationFrame(animate);
        const dt = Math.min((now - previous) / 1000, 0.05);
        previous = now;
        if (!active || document.hidden) return;
        const still = controls.current.paused || reduced;
        if (!still) time += dt;
        if (!drag) { const decay = Math.exp(-8 * dt); velocityX *= decay; velocityY *= decay; targetX = THREE.MathUtils.clamp(targetX + velocityX * dt * 30, -0.24, 0.45); targetY = THREE.MathUtils.clamp(targetY + velocityY * dt * 30, -0.65, 0.65); }
        if (renderedPerspective !== controls.current.perspective) {
          const next = [pageTexture('left', tone, ink, grid, controls.current.perspective), pageTexture('right', tone, ink, grid, controls.current.perspective)];
          model.updateTextures(next); textures.forEach(t => t.dispose()); textures = next;
          renderedPerspective = controls.current.perspective;
        }
        if (renderedViewpoint !== controls.current.viewpoint) {
          targetX = targetY = velocityX = velocityY = 0;
          renderedViewpoint = controls.current.viewpoint;
        }
        const book = kind === 'journal';
        const view = controls.current.viewpoint;
        const front = view === 'front', close = view === 'close';
        const baseX = front ? 0 : book ? -.40 : kind === 'desktop' ? .22 : -.04;
        const baseY = front ? 0 : book ? -.17 : -.30;
        const rx = baseX + targetX + (still || front ? 0 : Math.sin(time * .22) * .018);
        const ry = baseY + targetY + (still || front ? 0 : Math.sin(time * .28) * .025);
        const damp = reduced ? 1000 : 5;
        model.root.rotation.x = THREE.MathUtils.damp(model.root.rotation.x, rx, damp, dt);
        model.root.rotation.y = THREE.MathUtils.damp(model.root.rotation.y, ry, damp, dt);
        model.root.rotation.z = THREE.MathUtils.damp(model.root.rotation.z, front ? 0 : -.025, damp, dt);
        model.root.position.y = THREE.MathUtils.damp(model.root.position.y, close ? -.28 : still ? 0 : Math.sin(time * .4) * .025, damp, dt);
        model.root.position.x = THREE.MathUtils.damp(model.root.position.x, close && book ? 1.13 : 0, damp, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, fittedZ * (close ? .64 : 1), damp, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, front ? 0 : .5, damp, dt);
        camera.lookAt(0,0,0);
        model.pages.forEach((page, i) => {
          page.position.z = THREE.MathUtils.damp(page.position.z, controls.current.exploded ? 0.55 + i * 0.16 : 0, 5, dt);
        });
        renderer.render(scene, camera);
      };
      frame = requestAnimationFrame(animate);
      setReady(true);
      const lost = event => {
        event.preventDefault();
        setFailed(true);
      };
      renderer.domElement.addEventListener('webglcontextlost', lost);
      cleanup = () => {
        cancelAnimationFrame(frame);
        ro.disconnect();
        visibility.disconnect();
        media.removeEventListener('change', motionChange);
        el.removeEventListener('pointerdown', down);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        el.removeEventListener('keydown', keydown);
        renderer.domElement.removeEventListener('webglcontextlost', lost);
        const materials = new Set();
        scene.traverse(o => {
          o.geometry?.dispose();
          if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => materials.add(m));
        });
        materials.forEach(m => m.dispose());
        [...textures, grain, ...model.extraTextures].forEach(t => t.dispose());
        env.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };
    const lazy = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        lazy.disconnect();
        init();
      }
    }, {
      rootMargin: '250px'
    });
    lazy.observe(el);
    return () => {
      cancelled = true;
      lazy.disconnect();
      cleanup();
    };
  }, [kind, finish, tone, ink, grid]);
  return <div className={`pm-scene ${className}`}>
    {(!ready || failed) && <img className="pm-scene-fallback" src="/renders/decideone-studio-v2.png" alt="Decide One with white pages and a woven label" />}
    <div ref={host} className={`pm-canvas ${failed ? 'pm-canvas-failed' : ''}`} tabIndex={0} role="group" aria-label={`Interactive 3D ${kind === 'journal' ? perspective + ' instrument' : kind + ' preview'}, ${viewpoint} view. Drag with a mouse or use arrow keys to rotate. Scroll to continue. Home resets the angle.`} />
    {failed && <span className="pm-render-note">Product preview · 3D unavailable on this browser</span>}
  </div>;
}
