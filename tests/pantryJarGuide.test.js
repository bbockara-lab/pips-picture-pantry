import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { scheduleInitialJarDetailResume, shouldShowPantryJarIntro } from "../src/ui/pantryView.js";

const pantrySource = readFileSync(new URL("../src/ui/pantryView.js", import.meta.url), "utf8");
const appShellSource = readFileSync(new URL("../src/ui/appShell.js", import.meta.url), "utf8");

describe("pantry jar first-open guide", () => {
  it("shows only while the guide has not been acknowledged", () => {
    const unseen = vi.fn(() => false);
    const seen = vi.fn(() => true);

    expect(shouldShowPantryJarIntro(unseen)).toBe(true);
    expect(shouldShowPantryJarIntro(seen)).toBe(false);
    expect(unseen).toHaveBeenCalledWith("pantryJarIntro");
    expect(seen).toHaveBeenCalledWith("pantryJarIntro");
  });

  it("gates every jar detail through the same first-open check", () => {
    expect(pantrySource).toMatch(
      /const openDetail = \(jar\) => \{[\s\S]*?shouldShowPantryJarIntro\(\)[\s\S]*?onRequestJarGuide\(jar\)[\s\S]*?showJarDetail\(\{/
    );
    expect(pantrySource).toContain("renderShelf(shelf, ownedIds, equippedJars, openDetail)");
  });

  it("resumes the exact selected jar detail after the guide closes", () => {
    expect(appShellSource).toContain("pendingPantryJarDetailId = jar?.id || null");
    expect(appShellSource).toContain('activeGuide = "pantryJarIntro"');
    expect(appShellSource).toMatch(
      /function closeGuide\(\)[\s\S]*?markGuideSeen\(activeGuide\)[\s\S]*?draw\(\)/
    );
    expect(appShellSource).toContain("initialJarDetailId: pendingPantryJarDetailId");
    expect(pantrySource).toContain("PANTRY_JARS.find((jar) => jar.id === initialJarDetailId)");
    expect(pantrySource).toContain("scheduleInitialJarDetailResume({");
    expect(pantrySource).not.toContain("openDetail(initialJar)");
    expect(appShellSource).toContain("pendingPantryJarDetailId = null");
  });

  it("does not schedule repeated frames or re-enter the guide while it is open", () => {
    const jar = { id: "starter" };
    const frames = [];
    const showDetail = vi.fn();
    const onOpened = vi.fn();
    const requestFrame = vi.fn((callback) => frames.push(callback));

    for (let frame = 0; frame < 3; frame += 1) {
      expect(scheduleInitialJarDetailResume({
        jar,
        guidePending: true,
        showDetail,
        onOpened,
        requestFrame
      })).toBe(false);
    }

    expect(requestFrame).not.toHaveBeenCalled();
    expect(frames).toHaveLength(0);
    expect(showDetail).not.toHaveBeenCalled();
    expect(onOpened).not.toHaveBeenCalled();
  });

  it("opens the exact jar directly once after the guide is acknowledged", () => {
    const jar = { id: "starter" };
    const frames = [];
    const showDetail = vi.fn();
    const onOpened = vi.fn();

    expect(scheduleInitialJarDetailResume({
      jar,
      guidePending: false,
      showDetail,
      onOpened,
      requestFrame: (callback) => frames.push(callback)
    })).toBe(true);
    expect(frames).toHaveLength(1);

    frames.shift()();
    expect(showDetail).toHaveBeenCalledTimes(1);
    expect(showDetail).toHaveBeenCalledWith(jar);
    expect(onOpened).toHaveBeenCalledTimes(1);
    expect(onOpened).toHaveBeenCalledWith(jar);
  });
});
