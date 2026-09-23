import React from "react";
import SidebarSection from "./SidebarSection";
import VerticalHandler from "./VerticalHandler";

// SidebarContent.tsx
type Id = "vid" | "img" | "aud";
const ORDER: Id[] = ["vid", "img", "aud"];
const HEADER_HEIGHT = 24;
const BORDER = 4; // border-2 top + bottom
const COLLAPSED = HEADER_HEIGHT + BORDER;
const MIN_OPEN = 80; // px, replaces min-h-1/5 + getComputedStyle
const MIN_W = MIN_OPEN - BORDER; // same minimum, in weight units

const TITLES: Record<Id, string> = {
  vid: "Videos",
  img: "Images",
  aud: "Audio",
};

function SidebarContent() {
  const refs = {
    vid: React.useRef<HTMLDivElement>(null),
    img: React.useRef<HTMLDivElement>(null),
    aud: React.useRef<HTMLDivElement>(null),
  };
  const [collapsed, setCollapsed] = React.useState<Record<Id, boolean>>({
    vid: false,
    img: false,
    aud: false,
  });
  const [weights, setWeights] = React.useState<Record<Id, number>>({
    vid: 1,
    img: 1,
    aud: 1,
  });
  const [dragging, setDragging] = React.useState(false);

  const toggle = (id: Id) => setCollapsed((p) => ({ ...p, [id]: !p[id] }));

  const startDrag = (e: React.MouseEvent, above: Id, below: Id) => {
    e.preventDefault();
    const startY = e.clientY;

    const open = ORDER.filter((id) => !collapsed[id]);

    // 1. snapshot real heights (border excluded) as weights
    const pxSum = open.reduce(
      (s, id) => s + refs[id].current!.offsetHeight - BORDER,
      0,
    );
    const wSum = open.reduce((s, id) => s + weights[id], 0);
    const scale = pxSum / wSum; // keeps collapsed sections' remembered ratio consistent
    const snap = {} as Record<Id, number>;
    ORDER.forEach((id) => {
      snap[id] = collapsed[id]
        ? weights[id] * scale
        : refs[id].current!.offsetHeight - BORDER;
    });

    // 2. donor chains, nearest first
    const iA = open.indexOf(above);
    const iB = open.indexOf(below);
    const downDonors = open.slice(iB); // below, then further down
    const upDonors = open.slice(0, iA + 1).reverse(); // above, then further up

    const capacity = (ids: Id[]) =>
      ids.reduce((s, id) => s + Math.max(0, snap[id] - MIN_W), 0);
    const maxDown = capacity(downDonors);
    const maxUp = capacity(upDonors);

    // takes `amount` px from donors in order, each down to MIN_W at most
    const drain = (donors: Id[], amount: number, next: Record<Id, number>) => {
      let left = amount;
      for (const id of donors) {
        const take = Math.min(left, Math.max(0, snap[id] - MIN_W));
        next[id] = snap[id] - take;
        left -= take;
      }
    };

    const onMove = (ev: MouseEvent) => {
      const d = Math.max(-maxUp, Math.min(ev.clientY - startY, maxDown));
      const next = { ...snap };

      if (d >= 0) {
        // dragging down: `above` grows, donors below give
        next[above] = snap[above] + d;
        drain(downDonors, d, next);
      } else {
        // dragging up: `below` grows, donors above give
        next[below] = snap[below] - d;
        drain(upDonors, -d, next);
      }
      setWeights(next);
    };

    const onUp = () => {
      setDragging(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    setDragging(true);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const nextOpen = (i: number) =>
    ORDER.slice(i + 1).find((id) => !collapsed[id]);

  return (
    <div className="relative h-full flex-1 flex flex-col">
      {ORDER.map((id, i) => {
        const below = !collapsed[id] ? nextOpen(i) : undefined; // handle only between open sections
        return (
          <React.Fragment key={id}>
            <SidebarSection
              ref={refs[id]}
              title={TITLES[id]}
              isCollapsed={collapsed[id]}
              onToggle={() => toggle(id)}
              style={
                collapsed[id]
                  ? {
                      flex: `0 0 ${COLLAPSED}px`,
                      transition: "flex 0.15s ease-in-out",
                    }
                  : {
                      flex: `${weights[id]} 1 0px`,
                      minHeight: MIN_OPEN,
                      transition: dragging ? "none" : "flex 0.15s ease-in-out",
                    }
              }
            >
              {id}
            </SidebarSection>
            {below && (
              <VerticalHandler
                handleMouseDown={(e) => startDrag(e, id, below)}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default SidebarContent;
