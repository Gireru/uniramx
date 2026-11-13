import { useEffect, useState } from "react";

export default function useDemo() {
  const [demo, setDemoState] = useState(false);
  useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    if (url.get("demo") === "1") localStorage.setItem("unira_demo", "1");
    setDemoState(localStorage.getItem("unira_demo") === "1");
  }, []);
  const setDemo = (v) => {
    localStorage.setItem("unira_demo", v ? "1" : "0");
    setDemoState(v);
  };
  return [demo, setDemo];
}