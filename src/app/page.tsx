'use client'
import { useState } from 'react';
import Header from "@/app/layout/header";
import Sidebar from "@/app/layout/sidebar";
import Content from "@/app/layout/content";
import Footer from "@/app/layout/footer";
import { DataProvider } from "@/app/context/DataContext"

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<string>("revenue");

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <DataProvider>
      <main className="app-area">
        <Header selectedOption={selectedOption} />
        <Sidebar onOptionClick={handleOptionClick} />
        <Content selectedOption={selectedOption} />
        <Footer />
      </main>
    </DataProvider>
  );
}