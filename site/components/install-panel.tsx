"use client";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { AgentTabs } from "./agent-tabs";
import { CanvasIcon } from "./canvas-icon";
export function InstallPanel(props: ComponentProps<typeof AgentTabs>) {
  const [mobile, setMobile] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  useEffect(() => {
    const query = matchMedia("(max-width: 1023px)");
    const sync = () => {
      if (!query.matches) {
        dialog.current?.close();
        setOpen(false);
      }
      setMobile(query.matches);
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  if (!mobile)
    return (
      <aside className="install-panel">
        <AgentTabs {...props} />
      </aside>
    );
  return (
    <>
      <div className="install-mobile-bar">
        <span>Choose your agent and scope next</span>
        <button
          className="primary-button"
          onClick={() => {
            dialog.current?.showModal();
            setOpen(true);
          }}
        >
          Install skill <CanvasIcon name="arrow" />
        </button>
      </div>
      <dialog
        ref={dialog}
        className="install-dialog"
        aria-label="Install skill"
        onKeyDown={(e) => {
          if (e.key !== "Tab") return;
          const nodes = Array.from(
            e.currentTarget.querySelectorAll<HTMLElement>(
              'a[href],button,select,input,textarea,summary,[tabindex="0"]',
            ),
          ).filter(
            (n) =>
              n.tabIndex >= 0 &&
              !n.hasAttribute("disabled") &&
              n.getClientRects().length > 0,
          );
          const first = nodes[0],
            last = nodes.at(-1);
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            const r = e.currentTarget.getBoundingClientRect();
            if (e.clientY < r.top || e.clientX < r.left || e.clientX > r.right)
              dialog.current?.close();
          }
        }}
      >
        <div className="sheet-header">
          <span className="skill-pill">{props.slug}</span>
          <button
            className="icon-button"
            aria-label="Close installer"
            onClick={() => dialog.current?.close()}
          >
            <CanvasIcon name="close" />
          </button>
        </div>
        <AgentTabs {...props} />
      </dialog>
    </>
  );
}
