"use client";

/**
 * The closing frame's globe, as real geometry.
 *
 * It replaces a CSS trick that was already on the page: an equirectangular
 * texture scrolled behind a `border-radius: 50%` box with inset shadows faking
 * the shading. That reads as a sphere at a glance, but the map never converges
 * at the poles — it just stretches — and the "lighting" is a fixed gradient
 * that cannot respond to the rotation.
 *
 * Here the same texture (`globe-texture-dark.svg`, 179 country paths, 40 export
 * markers, the route arcs out of India) is wrapped onto a real sphere, lit from
 * the upper left so the terminator matches the shading the CSS version faked,
 * lit so the silhouette separates from the
 * cream page.
 *
 * The CSS globe is deliberately left in place underneath as the fallback: it
 * paints instantly, and if WebGL is unavailable or this module fails to load,
 * the page keeps the sphere it always had. `is-3d` is only added once the first
 * frame is on screen, and that class is what turns the CSS one off.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { ORIGIN, DESTINATIONS as ROUTES, type UV } from "@/lib/globe-routes";

/** one revolution, in seconds — the CSS globe's own `brand-globe-spin` */
const SPIN_PERIOD = 90;
/** Earth's axial tilt. Costs nothing and stops the spin reading as a turntable. */
const TILT = 23.4 * (Math.PI / 180);
/** the texture is 2000×1000; drawn at 2× so coastlines stay crisp on a 38vw sphere */
const TEX_W = 4096;
const TEX_H = 2048;

/** points sampled per route arc; also the resolution the pulse slides at */
const ARC_STEPS = 128;
/** how many of those points the travelling pulse covers */
const PULSE_LENGTH = 14;
/** seconds for one departure-to-arrival-to-departure cycle on a single route */
const ROUTE_CYCLE = 7;
/** the fraction of that cycle a pulse is actually in flight — the remainder is
    dead air, which is what keeps 39 simultaneous routes from reading as noise */
const ROUTE_TRAVEL = 0.4;

/**
 * A point on the texture, placed on the sphere.
 *
 * This has to invert THREE.SphereGeometry's own UV mapping exactly, or the
 * arcs drift off the coastlines: the geometry lays u along -cos/+sin of the
 * azimuth and v from the north pole down, so the same must happen here.
 * Working in the texture's UV space rather than lat/lon means the marker
 * coordinates lifted out of the SVG need no conversion at all.
 */
function uvToPoint([u, v]: UV, radius = 1.004): THREE.Vector3 {
  const theta = v * Math.PI;
  const phi = u * Math.PI * 2;
  return new THREE.Vector3(
    -radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export default function Globe() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // no WebGL — the CSS globe underneath stays as it is
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    /* fov 30 at z 3.9 puts a unit sphere just inside the frame, so the
       silhouette lands on the same circle the CSS globe occupied */
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.z = 3.9;

    const globe = new THREE.Group();
    globe.rotation.z = TILT;
    scene.add(globe);

    const geometry = new THREE.SphereGeometry(1, 96, 64);
    /* No ocean: the texture is drawn on a transparent canvas, so only the land
       paths, the country dots and the arcs are solid and the page shows
       through everywhere else. Back faces are culled by default, so the far
       side's land does not print through the near one. */
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1,
      metalness: 0,
      transparent: true,
    });
    const sphere = new THREE.Mesh(geometry, material);

    /* The map and the routes turn together, as one body. Rotating the sphere
       alone would slide the land out from under arcs pinned to the camera —
       the routes have to stay welded to the cities they connect.
       The opening angle puts India square to the camera — solved, not eyeballed:
       it is the rotation that carries ORIGIN's bearing in the xz-plane round to
       +Z. Every route leaves from there, so facing it is what turns the arcs
       from a tangle on the limb into a fan across the visible face. It is also
       the only framing a reduced-motion visitor ever sees, since for them the
       world never turns off this frame. */
    const world = new THREE.Group();
    world.rotation.y = Math.PI * 1.0667;
    world.add(sphere);
    globe.add(world);

    /* ---------- the export routes ----------
       One arc per destination, lifted off the surface so it reads as a flight
       path rather than a line drawn on the map. Each is a quadratic Bézier
       through a raised midpoint, and the lift scales with how far the route
       travels — a hop to Turkey stays low, Brazil climbs.

       Endpoints come from the texture's own marker coordinates, so an arc
       lands exactly on the painted dot rather than near it. */
    const arcs = ROUTES.map(([u, v]) => {
      const from = uvToPoint(ORIGIN);
      const to = uvToPoint([u, v]);
      const spread = from.angleTo(to);
      const mid = from
        .clone()
        .add(to)
        .normalize()
        .multiplyScalar(1 + spread * 0.24);
      return new THREE.QuadraticBezierCurve3(from, mid, to).getPoints(ARC_STEPS);
    });

    /* the network at rest: every route, always on, faint. This is what says
       "40 countries" at a glance — the travelling pulses are the life on top,
       not the information. One LineSegments for all of them, one draw call. */
    const restPositions = new Float32Array(arcs.length * ARC_STEPS * 2 * 3);
    let w = 0;
    for (const points of arcs) {
      for (let i = 0; i < ARC_STEPS; i++) {
        points[i].toArray(restPositions, w);
        points[i + 1].toArray(restPositions, w + 3);
        w += 6;
      }
    }
    const restGeometry = new THREE.BufferGeometry();
    restGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(restPositions, 3)
    );
    const restMaterial = new THREE.LineBasicMaterial({
      color: 0x8a8a99,
      transparent: true,
      opacity: 0.32,
    });
    world.add(new THREE.LineSegments(restGeometry, restMaterial));

    /* the pulses: one per route, each a short bright window slid along its own
       arc by setDrawRange. No geometry is rebuilt per frame and no shader is
       involved — the whole animation is two integers per route. */
    const pulseMaterial = new THREE.LineBasicMaterial({
      color: 0xf2efea,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const pulses = arcs.map((points) => {
      const g = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(g, pulseMaterial);
      line.frustumCulled = false; // it lives inside the globe's own bounds
      world.add(line);
      return g;
    });
    /* staggered by a golden-ratio step rather than i/n: a linear spread makes
       the departures land in a visible rotating sweep, this scatters them */
    const phases = pulses.map((_, i) => (i * 0.6180339887) % 1);

    /* Reduced motion gets the network, not the traffic: the pulses never
       travel, so instead of freezing 39 of them mid-flight at whatever
       arbitrary point the first frame caught, drop them and let the resting
       lines carry the whole thing at full strength. */
    if (still) {
      for (const g of pulses) g.setDrawRange(0, 0);
      restMaterial.opacity = 0.55;
    }

    /* key from the upper left, matching the highlight the CSS inset shadow put
       there, so swapping the two does not move the light */
    const key = new THREE.DirectionalLight(0xfff2ec, 1.9);
    key.position.set(-2.2, 1.8, 2.4);
    scene.add(key);
    /* a dim bounce on the dark side — the bone page, reflected back */
    const fill = new THREE.DirectionalLight(0xf2efea, 0.55);
    fill.position.set(2.5, -1, -1.5);
    scene.add(fill);
    /* generous ambient on purpose: a physically-correct terminator would eat
       most of the disc, and the coastlines are the whole point of the frame */
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));

    let texture: THREE.CanvasTexture | undefined;
    let frame = 0;
    let disposed = false;

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    /* mouse parallax — the globe leans a few degrees toward the pointer. Small
       enough that it reads as depth rather than as a control. */
    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 0.28;
      target.y = (e.clientY / window.innerHeight - 0.5) * 0.2;
    };
    if (!still) window.addEventListener("pointermove", onMove, { passive: true });

    /* delta straight off the rAF timestamp — THREE.Clock is deprecated and
       THREE.Timer is one more thing to keep, for a subtraction */
    let last = 0;
    let elapsed = 0;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      elapsed += dt;

      world.rotation.y += (Math.PI * 2 * dt) / SPIN_PERIOD;
      eased.x += (target.x - eased.x) * 0.05;
      eased.y += (target.y - eased.y) * 0.05;
      globe.rotation.x = eased.y;
      globe.position.x = eased.x * 0.08;

      /* slide each pulse along its arc. Outside its travel window the route
         draws nothing and only the faint resting line remains. */
      for (let i = 0; i < pulses.length; i++) {
        const p = (elapsed / ROUTE_CYCLE + phases[i]) % 1;
        if (p > ROUTE_TRAVEL) {
          pulses[i].setDrawRange(0, 0);
          continue;
        }
        const travelled = p / ROUTE_TRAVEL;
        const start = Math.round(travelled * (ARC_STEPS - PULSE_LENGTH));
        pulses[i].setDrawRange(start, PULSE_LENGTH);
      }

      renderer.render(scene, camera);
    };

    /* This is the last frame of a long scroll page, so it is off screen for
       most of the session — and every frame it renders is a frame GSAP does
       not get. Run only while it is actually visible. Under reduced motion
       there is nothing to animate, so the loop never starts at all: the single
       render below is the whole of it. */
    let onScreen = false;
    const sync = () => {
      const wanted = onScreen && !document.hidden && !still;
      if (wanted && !frame) {
        last = 0; // never bill the paused stretch as one long frame
        frame = requestAnimationFrame(tick);
      } else if (!wanted && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    const visibility = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    document.addEventListener("visibilitychange", sync);

    /* Draw the SVG through an <img> rather than shipping a second PNG: the file
       is already on the page for the fallback, and rasterising it here means
       the sphere's texture resolution is ours to choose. */
    const img = new Image();
    img.src = "/images/globe-texture-dark.svg";
    img
      .decode()
      .then(() => {
        if (disposed) return;
        const canvas = document.createElement("canvas");
        canvas.width = TEX_W;
        canvas.height = TEX_H;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, TEX_W, TEX_H);

        texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.wrapS = THREE.RepeatWrapping;
        material.map = texture;
        material.needsUpdate = true;

        renderer.render(scene, camera);
        /* only now hand over from the CSS globe, so there is no frame where
           neither of them is painted */
        host.parentElement?.classList.add("is-3d");
        visibility.observe(host);
      })
      .catch(() => {
        /* texture failed — leave the CSS globe visible and take the canvas away */
        renderer.domElement.remove();
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onMove);
      host.parentElement?.classList.remove("is-3d");
      renderer.domElement.remove();
      texture?.dispose();
      geometry.dispose();
      material.dispose();
      restGeometry.dispose();
      restMaterial.dispose();
      for (const g of pulses) g.dispose();
      pulseMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={hostRef} className="brand__globe__gl" aria-hidden />;
}
