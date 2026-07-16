import HomeScreen from "@/components/screens/HomeScreen";
import { useEffect } from "react";
export default function Home() {
  useEffect(() => {
    console.log("HOME SCREEN MOUNTED");
  }, []);
  return <HomeScreen />;
}
