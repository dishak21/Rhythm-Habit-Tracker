"use client";

import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">About Rhythm</h1>
      <p className="text-white/80 leading-relaxed">
        At Rhythm, we believe that every small habit is like a beat in the larger symphony of life. Traditional habit trackers force rigid routines—but real growth happens when habits flow naturally. That's why we built an AI-powered habit tracker that moves with you, adapting to your lifestyle like a perfectly timed rhythm.
        </p><br /><br />
      
      <section className="mb-12 bg-white/10 p-8 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <span className="mr-3">🎵</span>What We Do
        </h2>
        
        <p className="text-white/80 leading-relaxed mt-4">
          Our intelligent system listens to your daily patterns and harmonizes your habits into seamless, personalized routines. Whether you're balancing work, wellness, learning, or creativity, Rhythm ensures your habits stay in sync with your life—so you can focus on what truly matters.
        </p>
      </section>

      <section className="mb-12 bg-white/10 p-8 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <span className="mr-3">🌊</span>Why Rhythm is Different
        </h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <span className="mr-3 text-green-400">✔</span>
            <p className="text-white/80">
              <strong>AI-powered habit optimization</strong> – No manual tracking; your routine adapts to your unique tempo.
            </p>
          </div>
          <div className="flex items-start">
            <span className="mr-3 text-green-400">✔</span>
            <p className="text-white/80">
              <strong>Seamless integration</strong> – Sync with calendars, productivity tools, and daily workflows.
            </p>
          </div>
          <div className="flex items-start">
            <span className="mr-3 text-green-400">✔</span>
            <p className="text-white/80">
              <strong>Engaging experience</strong> – Gamification and personalized nudges keep you motivated.
            </p>
          </div>
          <div className="flex items-start">
            <span className="mr-3 text-green-400">✔</span>
            <p className="text-white/80">
              <strong>Holistic approach</strong> – More than just productivity—Rhythm supports wellness, focus, and balance.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12 bg-white/10 p-8 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <span className="mr-3">💡</span>Our Mission
        </h2>
        <p className="text-white/80 leading-relaxed">
          We're redefining habit formation by making it intuitive, effortless, and naturally aligned with your life's flow. Whether you're an individual striving for self-improvement, a company enhancing employee well-being, or a university supporting student success—Rhythm helps you build sustainable habits that evolve with you.
        </p>
      </section>

      <section className="mb-12 bg-white/10 p-8 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <span className="mr-3">🌍</span>Where We're Headed
        </h2>
        <p className="text-white/80 leading-relaxed">
          We envision a future where AI seamlessly integrates into daily life, orchestrating habits that empower millions. With cutting-edge technology, behavioural science, and a deep passion for self-improvement, we're creating the next wave of habit tracking—one that moves with you, not against you.
        </p>
      </section>

      <section className="text-center bg-purple-600 p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">📲 Join the Rhythm</h2>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          It's time to sync your habits with your life's natural flow. Sign up today and let's create waves of positive change—one rhythm at a time. 🌊🎶
        </p>
        
      </section>

      
    </div>
  );
};

export default AboutPage;