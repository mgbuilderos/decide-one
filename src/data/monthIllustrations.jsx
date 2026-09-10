import React from "react";

/**
 * 12 Museum-Grade Japanese Botanical Woodblock & Celestial Line-Art Illustrations.
 * Inspired by classic 19th-century Japanese botanical woodblock prints (Honzo Zufu),
 * European botanical etchings, and astronomical equinox / solstice celestial charts.
 * Rendered using precise vector strokes, organic venation, stippling, and fine contour shading.
 */
export const MONTH_ILLUSTRATIONS = {
  // January: Deep Winter Alpine Peaks, Conifer Silhouette & Northern Star
  0: {
    name: "January",
    theme: "Alpine Solitude & The North Star",
    render: (className = "w-32 h-32") => (
      <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Celestial Orbital Equinox Rings */}
        <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.25" />
        <circle cx="60" cy="60" r="44" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" />
        
        {/* Eight-Point Faceted Polaris Star */}
        <g transform="translate(60, 26)">
          <path d="M0 -12L2.5 -3.5L11 0L2.5 3.5L0 12L-2.5 3.5L-11 0L-2.5 -3.5Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
          <line x1="0" y1="-14" x2="0" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="-14" y1="0" x2="14" y2="0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="-5" y1="-5" x2="5" y2="5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.6" />
          <line x1="-5" y1="5" x2="5" y2="-5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.6" />
          <circle cx="0" cy="0" r="1.5" fill="currentColor" />
        </g>

        {/* Crescent Moon & Stardust */}
        <path d="M86 34C83 34 81 31 82 27C77 29 76 35 80 39C83 42 89 41 91 37C88 38 86 36 86 34Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round" />
        <circle cx="34" cy="30" r="0.8" fill="currentColor" />
        <circle cx="88" cy="48" r="0.8" fill="currentColor" />

        {/* Layered Mountain Ridges with Ridge Hatching */}
        {/* Background Ridge */}
        <path d="M18 94L42 56L62 76L76 60L102 94" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Mountain Ridge Shading Hatching */}
        <path d="M42 56L46 72L50 94" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.6" />
        <path d="M76 60L78 74L82 94" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.6" />
        
        {/* Foreground Sharp Alpine Peaks */}
        <path d="M26 94L54 44L72 72L86 52L96 94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M54 44L52 64L50 94" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <line x1="53" y1="52" x2="44" y2="60" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5" />
        <line x1="52" y1="62" x2="40" y2="72" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5" />
        <line x1="51" y1="74" x2="36" y2="86" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5" />

        {/* Alpine Conifer Trees Base */}
        <path d="M30 94V84M28 88L30 84L32 88M27 91L30 87L33 91" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M88 94V82M86 86L88 82L90 86M85 89L88 85L91 89" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Ground Baseline */}
        <line x1="16" y1="94" x2="104" y2="94" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5" />
      </svg>
    )
  },

  // February: Botanical Snowdrop Awakening (Galanthus Nivalis)
  1: {
    name: "February",
    theme: "Snowdrop Awakening & The First Thaw",
    render: (className = "w-32 h-32") => (
      <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.25" />
        
        {/* Main Arching Stem */}
        <path d="M52 98C52 74 56 54 68 40C71 36 76 35 77 39C77 43 73 46 72 48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Snowdrop Bell Flower 1 (Primary Drooping Bloom) */}
        <g transform="translate(72, 48)">
          {/* Flower Cap (Spathe) */}
          <path d="M-2 -2C0 -6 4 -6 6 -2C4 0 0 0 -2 -2Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
          {/* Outer Petals */}
          <path d="M0 0C-8 6 -10 18 -4 24C-2 18 2 12 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M4 0C12 6 14 18 8 24C6 18 2 12 0 4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          {/* Central Petal with Botanical Inverted-V Notch */}
          <path d="M-3 4C-2 18 1 25 2 27C3 25 6 18 7 4Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M0 20L2 17L4 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          {/* Petal Venation Striae */}
          <line x1="2" y1="4" x2="2" y2="16" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5" />
        </g>

        {/* Secondary Delicate Bud */}
        <path d="M52 82C52 68 46 58 40 50C38 48 35 48 35 51C35 54 38 57 39 59" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <g transform="translate(39, 59)">
          <path d="M-2 0C-6 4 -6 12 -2 16C0 12 1 8 0 2" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
          <path d="M2 0C6 4 6 12 2 16C0 12 -1 8 0 2" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
          <path d="M-1 2C0 10 1 15 1 15C1 15 2 10 3 2Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="0.9" />
        </g>

        {/* Long Botanical Leaves with Central Veins */}
        <path d="M52 98C44 84 38 70 42 54C48 68 50 82 52 98Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M42 54C45 68 48 82 52 98" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
        <path d="M52 98C58 88 66 78 64 64C60 76 56 86 52 98Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M64 64C61 76 57 86 52 98" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />

        {/* Thawing Snow Base Contour */}
        <path d="M30 98C38 95 46 99 54 97C62 95 72 98 84 96" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="78" cy="98" r="0.8" fill="currentColor" strokeOpacity="0.5" />
        <circle cx="86" cy="99" r="0.6" fill="currentColor" strokeOpacity="0.5" />
      </svg>
    )
  },

  // March: Vernal Equinox & Japanese Magnolia Branch (Magnolia Stellata)
  2: {
    name: "March",
    theme: "Vernal Equinox & Magnolia Bloom",
    render: (className = "w-32 h-32") => (
      <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.25" />
        {/* Equinox Meridian Lines */}
        <line x1="60" y1="12" x2="60" y2="108" stroke="currentColor" strokeWidth="0.7" strokeDasharray="4 3" strokeOpacity="0.3" />
        <line x1="12" y1="60" x2="108" y2="60" stroke="currentColor" strokeWidth="0.7" strokeDasharray="4 3" strokeOpacity="0.3" />

        {/* Rugged Woody Magnolia Branch */}
        <path d="M22 86C36 78 48 70 58 56C66 46 76 40 88 36" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M58 56C64 64 72 68 82 70" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        
        {/* Primary Blooming Magnolia Flower */}
        <g transform="translate(88, 36)">
          {/* Back Petals */}
          <path d="M-6 -6C-12 -16 -4 -24 4 -22C10 -16 6 -8 0 -4" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M2 -8C10 -20 22 -18 20 -10C16 -4 8 -2 2 -4" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          {/* Central Petals */}
          <path d="M-4 -2C-8 -12 2 -18 8 -14C12 -8 8 -2 0 0" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M-2 0C-4 8 4 14 10 10C12 4 6 -2 0 0" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          {/* Petal Veins */}
          <path d="M-2 -8C0 -14 4 -16 5 -18" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.6" />
          {/* Flower Base Calyx */}
          <path d="M-3 0C-5 4 -2 7 2 6C5 5 4 1 0 0" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
        </g>

        {/* Swollen Fuzzy Flower Bud */}
        <g transform="translate(82, 70)">
          <path d="M0 0C4 -4 10 -4 12 0C14 6 8 10 2 8Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <line x1="2" y1="1" x2="8" y2="4" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.6" />
        </g>

        {/* Early Sprouting Leaf */}
        <path d="M44 74C38 68 40 60 48 62C52 68 48 72 44 74Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        <line x1="44" y1="74" x2="46" y2="64" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5" />
      </svg>
    )
  },

  // April: Sakura Cherry Blossom Branch & Floating Petals Drift
  3: {
    name: "April",
    theme: "Spring Showers & Sakura Petals",
    render: (className = "w-32 h-32") => (
      <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.25" />
        
        {/* Weeping Cherry Blossom Branch */}
        <path d="M22 40C38 38 52 46 64 56C72 64 80 82 86 96" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M52 46C56 36 64 30 76 26" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />

        {/* Master 5-Petal Sakura Blossom */}
        <g transform="translate(64, 56)">
          {/* 5 Distinct Heart-Notched Sakura Petals */}
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <g key={i} transform={`rotate(${angle})`}>
              <path d="M0 0C-4 -8 -6 -14 -2 -17C0 -18 2 -16 0 -14C-2 -16 0 -18 2 -17C6 -14 4 -8 0 0Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
              <line x1="0" y1="-2" x2="0" y2="-9" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5" />
            </g>
          ))}
          <circle cx="0" cy="0" r="2" fill="currentColor" />
        </g>

        {/* Secondary Open Blossom */}
        <g transform="translate(76, 26)">
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <g key={i} transform={`rotate(${angle})`}>
              <path d="M0 0C-3 -6 -4 -10 -1 -12C0 -13 1 -11 0 -10C-1 -11 0 -13 1 -12C4 -10 3 -6 0 0Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
            </g>
          ))}
          <circle cx="0" cy="0" r="1.5" fill="currentColor" />
        </g>

        {/* Swirling Wind Currents & Drifting Petals */}
        <path d="M30 68C44 74 60 72 74 64C86 56 94 44 98 32" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.35" strokeLinecap="round" />
        {/* Floating Petal 1 */}
        <path d="M42 84C46 78 54 82 52 88C48 92 40 90 42 84Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
        {/* Floating Petal 2 */}
        <path d="M84 76C88 72 94 76 92 82C88 84 82 82 84 76Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
        {/* Floating Petal 3 */}
        <path d="M34 50C36 46 42 48 40 54C36 56 32 54 34 50Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round" />
      </svg>
    )
  },

  // May: Botanical Double Peony (Paeonia Suffruticosa) & Flourishing Leaves
  4: {
    name: "May",
    theme: "Botanical Peony & Vital Bloom",
    render: (className = "w-32 h-32") => (
      <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.25" />
        
        {/* Main Stem */}
        <path d="M60 76V102" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />

        {/* Large Botanical Double Peony Blossom */}
        <g transform="translate(60, 50)">
          {/* Outer Layer Petals with Scalloped Folds */}
          <path d="M0 -30C-16 -30 -28 -18 -26 -4C-24 10 -12 24 0 26C12 24 24 10 26 -4C28 -18 16 -30 0 -30Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M-22 -8C-28 6 -16 20 0 24C16 20 28 6 22 -8" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          
          {/* Middle Petal Layer with Deep Natural Clefts */}
          <path d="M-14 -20C-22 -10 -18 6 -8 14C-2 18 2 18 8 14C18 6 22 -10 14 -20C6 -26 -6 -26 -14 -20Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M-12 -6C-6 4 0 6 6 4C10 0 12 -8 8 -14" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
          
          {/* Inner Curled Petals & Heart Core */}
          <path d="M-6 -8C-10 -2 -6 6 0 6C6 6 10 -2 6 -8C2 -12 -2 -12 -6 -8Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <circle cx="0" cy="-2" r="2.5" fill="currentColor" />
          <path d="M-2 -18V-10M4 -18V-10M-12 -12L-6 -6M12 -12L6 -6" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.5" />
        </g>

        {/* Deeply Serrated Botanical Peony Leaves */}
        {/* Left Leaf Cluster */}
        <g transform="translate(60, 84)">
          <path d="M0 0C-12 -2 -24 -10 -30 -22C-26 -16 -20 -18 -18 -24C-14 -18 -8 -16 -6 -12C-4 -6 -2 -2 0 0Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <line x1="0" y1="0" x2="-22" y2="-18" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.6" />
        </g>
        {/* Right Leaf Cluster */}
        <g transform="translate(60, 90)">
          <path d="M0 0C14 -2 26 -8 32 -18C28 -14 24 -16 22 -22C16 -16 10 -14 8 -10C4 -4 2 -1 0 0Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <line x1="0" y1="0" x2="24" y2="-14" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.6" />
        </g>
      </svg>
    )
  },

  // June: Solstice Radiant Sun & Undulating Horizon
  5: {
    name: "June",
    theme: "Summer Solstice & Radiant Sun",
    render: (className = "w-32 h-32") => (
      <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.25" />
        
        {/* Concentric Astronomical Rings */}
        <circle cx="60" cy="54" r="32" stroke="currentColor" strokeWidth="0.7" strokeDasharray="2 2" strokeOpacity="0.3" />
        <circle cx="60" cy="54" r="22" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.5" />
        <circle cx="60" cy="54" r="14" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="60" cy="54" r="4" fill="currentColor" />

        {/* 16 Alternating Curved and Straight Solar Rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <g key={i} transform={`translate(60, 54) rotate(${deg})`}>
            <line x1="0" y1="-16" x2="0" y2="-28" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="0" cy="-30" r="1" fill="currentColor" />
          </g>
        ))}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg, i) => (
          <g key={i} transform={`translate(60, 54) rotate(${deg})`}>
            <path d="M0 -16C-2 -20 2 -22 0 -26" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
          </g>
        ))}

        {/* Gentle Rolling Horizon with Summer Grass Etchings */}
        <path d="M18 94C38 88 56 96 74 90C88 86 98 90 102 94" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="36" y1="91" x2="38" y2="84" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.6" />
        <line x1="42" y1="92" x2="46" y2="86" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.6" />
        <line x1="78" y1="89" x2="80" y2="83" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.6" />
      </svg>
    )
  },

  // July: Ocean Tides & Japanese Woodblock Wave Swell (Great Wave Motif)
  6: {
    name: "July",
    theme: "Ocean Tides & The Summer Sea",
    render: (className = "w-32 h-32") => (
      <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.25" />
        
        {/* Distant Summer Sun */}
        <circle cx="60" cy="38" r="12" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.2" />
        <line x1="60" y1="20" x2="60" y2="24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.5" />

        {/* Primary Rolling Wave with Curling Foam Talons */}
        <path d="M16 88C32 88 44 80 56 70C66 60 76 44 86 46C92 48 94 56 88 62C84 66 78 66 76 60C74 54 80 52 82 54" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        {/* Wave Crest Foam Talons */}
        <path d="M86 46C82 44 80 40 82 36M84 48C88 44 92 44 96 46M78 52C74 50 72 46 72 42" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />

        {/* Internal Wave Contour Lines (Water Currents) */}
        <path d="M22 92C36 92 48 84 58 76C68 68 76 56 82 56" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.5" />
        <path d="M28 96C40 96 52 88 62 82C70 76 76 68 80 66" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        
        {/* Secondary Foreground Swell */}
        <path d="M42 96C56 94 68 86 78 86C86 86 94 92 104 90" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        
        {/* Sea Spray Droplets */}
        <circle cx="70" cy="40" r="1.2" fill="currentColor" />
        <circle cx="94" cy="38" r="1" fill="currentColor" />
        <circle cx="62" cy="48" r="0.8" fill="currentColor" />
        <circle cx="100" cy="54" r="0.8" fill="currentColor" />
      </svg>
    )
  },

  // August: Hand-Tied Botanical Wheat Sheaf (Triticum Aestivum)
  7: {
    name: "August",
    theme: "Golden Harvest & Ripened Wheat",
    render: (className = "w-32 h-32") => (
      <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.25" />
        
        {/* Center Main Wheat Ear */}
        <g transform="translate(60, 24)">
          <line x1="0" y1="20" x2="0" y2="76" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          {/* Individual Grains with Long Whispering Awns */}
          {[0, 6, 12, 18, 24, 30].map((y, i) => (
            <g key={i}>
              {/* Left Grain */}
              <path d={`M0 ${y + 4}C-5 ${y + 1} -6 ${y - 3} -2 ${y - 5}C0 ${y - 4} 0 ${y} 0 ${y + 4}Z`} fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.1" />
              <line x1={`-2`} y1={`${y - 5}`} x2={`-12`} y2={`${y - 15}`} stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
              {/* Right Grain */}
              <path d={`M0 ${y + 4}C5 ${y + 1} 6 ${y - 3} 2 ${y - 5}C0 ${y - 4} 0 ${y} 0 ${y + 4}Z`} fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.1" />
              <line x1={`2`} y1={`${y - 5}`} x2={`12`} y2={`${y - 15}`} stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
            </g>
          ))}
          {/* Top Kernel & Terminal Awn */}
          <circle cx="0" cy="-2" r="2" fill="currentColor" />
          <line x1="0" y1="-2" x2="0" y2="-18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Left Tilting Wheat Ear */}
        <g transform="translate(46, 32) rotate(-18)">
          <line x1="0" y1="16" x2="0" y2="60" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          {[0, 6, 12, 18].map((y, i) => (
            <g key={i}>
              <path d={`M0 ${y + 3}C-4 ${y} -5 ${y - 3} -1 ${y - 4}C0 ${y - 3} 0 ${y} 0 ${y + 3}Z`} fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1" />
              <line x1={`-1`} y1={`${y - 4}`} x2={`-9`} y2={`${y - 12}`} stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
              <path d={`M0 ${y + 3}C4 ${y} 5 ${y - 3} 1 ${y - 4}C0 ${y - 3} 0 ${y} 0 ${y + 3}Z`} fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1" />
              <line x1={`1`} y1={`${y - 4}`} x2={`9`} y2={`${y - 12}`} stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
            </g>
          ))}
        </g>

        {/* Right Tilting Wheat Ear */}
        <g transform="translate(74, 32) rotate(18)">
          <line x1="0" y1="16" x2="0" y2="60" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          {[0, 6, 12, 18].map((y, i) => (
            <g key={i}>
              <path d={`M0 ${y + 3}C-4 ${y} -5 ${y - 3} -1 ${y - 4}C0 ${y - 3} 0 ${y} 0 ${y + 3}Z`} fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1" />
              <line x1={`-1`} y1={`${y - 4}`} x2={`-9`} y2={`${y - 12}`} stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
              <path d={`M0 ${y + 3}C4 ${y} 5 ${y - 3} 1 ${y - 4}C0 ${y - 3} 0 ${y} 0 ${y + 3}Z`} fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1" />
              <line x1={`1`} y1={`${y - 4}`} x2={`9`} y2={`${y - 12}`} stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
            </g>
          ))}
        </g>

        {/* Traditional Tied Raffia Ribbon at Sheaf Waist */}
        <path d="M50 78C56 76 64 76 70 78" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M52 81C58 79 62 79 68 81" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M60 80C56 86 52 92 48 96M60 80C64 86 66 92 70 96" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    )
  },

  // September: Universal Global Equinox & The Celestial Scales of Libra (Astronomical Astrolabe)
  8: {
    name: "September",
    theme: "The Universal Equinox & Celestial Scales",
    render: (className = "w-36 h-36") => (
      <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* =========================================================================
            1. ASTRONOMICAL ASTROLABE HORIZON & EQUINOX MERIDIAN RINGS
            ========================================================================= */}
        {/* Outer Precision Meridian Ring */}
        <circle cx="60" cy="60" r="53" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.35" />
        {/* Inner Astrolabe Coordinate Ring with Fine Dashes */}
        <circle cx="60" cy="60" r="49" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.5 2.5" strokeOpacity="0.25" />
        <circle cx="60" cy="60" r="45" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.15" />

        {/* 24 Solar Hour Ticks (The 24 Hours of Day & Night) */}
        <line x1="60" y1="7" x2="60" y2="11" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
        <line x1="60" y1="109" x2="60" y2="113" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
        <line x1="7" y1="60" x2="11" y2="60" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
        <line x1="109" y1="60" x2="113" y2="60" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />

        {/* Diagonal Astrolabe Caliper Marks (0°, 90°, 180°, 270° Axes) */}
        <line x1="25" y1="25" x2="28" y2="28" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.35" />
        <line x1="95" y1="25" x2="92" y2="28" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.35" />
        <line x1="25" y1="95" x2="28" y2="92" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.35" />
        <line x1="95" y1="95" x2="92" y2="92" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.35" />

        {/* Universal Equinox Celestial Horizon (Equal Day & Night Line across all Earth) */}
        <line x1="12" y1="60" x2="108" y2="60" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.20" />
        <line x1="60" y1="12" x2="60" y2="108" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.15" />

        {/* =========================================================================
            2. THE CELESTIAL SCALES OF LIBRA (COSMIC BALANCE OF EQUINOX)
            ========================================================================= */}
        {/* Supreme Pivot Star & Suspension Ring (Apex Fulcrum) */}
        <g transform="translate(60, 22)">
          {/* Top Suspension Loop */}
          <circle cx="0" cy="0" r="4" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.7" fill="none" />
          <circle cx="0" cy="0" r="1.5" fill="currentColor" fillOpacity="0.8" />
          {/* North Star Radiant Spikes */}
          <line x1="0" y1="-8" x2="0" y2="-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
          <line x1="-8" y1="0" x2="-5" y2="0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
          <line x1="5" y1="0" x2="8" y2="0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
        </g>

        {/* Central Architectural Balance Column */}
        <path d="M60 26V74" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M57 36H63" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M58 48H62" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
        <path d="M56 68H64" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        {/* Column Plinth Base */}
        <path d="M53 74H67L64 77H56Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        <circle cx="60" cy="80" r="1.5" fill="currentColor" fillOpacity="0.4" />

        {/* Master Horizontal Crossbeam (Architectural Balance Arm) */}
        <g transform="translate(60, 36)">
          {/* Main Tapered Fulcrum Crossbeam */}
          <path d="M-34 0C-20 -1.5 20 -1.5 34 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="0" cy="0" r="2.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.2" />
          {/* Crossbeam Terminal Finials */}
          <circle cx="-34" cy="0" r="2" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="1" />
          <circle cx="34" cy="0" r="2" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="1" />
          {/* Subtle Pointer Needle (Equilibrium Indicator aligned at 0°) */}
          <line x1="0" y1="0" x2="0" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="0" cy="11" r="0.9" fill="currentColor" />
        </g>

        {/* =========================================================================
            3. LEFT BALANCE PAN: THE SOLAR DAY HEMISPHERE (12 HOURS DAY)
            ========================================================================= */}
        {/* Three Fine Suspension Cords descending to Pan */}
        <line x1="26" y1="36" x2="19" y2="64" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5" />
        <line x1="26" y1="36" x2="26" y2="64" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5" />
        <line x1="26" y1="36" x2="33" y2="64" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5" />
        {/* Concave Brass Balance Pan */}
        <path d="M17 64C17 72 35 72 35 64Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <ellipse cx="26" cy="64" rx="9" ry="2" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />
        
        {/* Solar Emblem resting in Left Pan (Radiant Sun) */}
        <g transform="translate(26, 55)">
          <circle cx="0" cy="0" r="4.5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="1.5" fill="currentColor" />
          {/* Solar Corona Rays */}
          <line x1="0" y1="-7" x2="0" y2="-9" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
          <line x1="0" y1="7" x2="0" y2="9" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
          <line x1="-7" y1="0" x2="-9" y2="0" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
          <line x1="7" y1="0" x2="9" y2="0" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
          <line x1="-5" y1="-5" x2="-6.5" y2="-6.5" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
          <line x1="5" y1="-5" x2="6.5" y2="-6.5" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
        </g>

        {/* =========================================================================
            4. RIGHT BALANCE PAN: THE LUNAR NIGHT HEMISPHERE (12 HOURS NIGHT)
            ========================================================================= */}
        {/* Three Fine Suspension Cords descending to Pan */}
        <line x1="94" y1="36" x2="87" y2="64" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5" />
        <line x1="94" y1="36" x2="94" y2="64" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5" />
        <line x1="94" y1="36" x2="101" y2="64" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5" />
        {/* Concave Brass Balance Pan */}
        <path d="M85 64C85 72 103 72 103 64Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <ellipse cx="94" cy="64" rx="9" ry="2" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" fill="none" />

        {/* Lunar Emblem resting in Right Pan (Crescent Moon & Nocturnal Star) */}
        <g transform="translate(94, 55)">
          <path d="M-3 -5C-1 -5 3 -2 3 3C3 6 1 8 -2 9C2 8 6 5 6 1C6 -3 2 -6 -3 -5Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
          {/* Little Star in Lunar Embrace */}
          <circle cx="-1" cy="0" r="1" fill="currentColor" />
          <circle cx="5" cy="-6" r="0.8" fill="currentColor" strokeOpacity="0.6" />
        </g>

        {/* =========================================================================
            5. LIBRA CONSTELLATION STARS & CELESTIAL EQUINOX GLYPH
            ========================================================================= */}
        {/* Zubeneschamali (Beta Librae) - Northern Claw Star */}
        <g transform="translate(42, 28)">
          <line x1="-3" y1="0" x2="3" y2="0" stroke="currentColor" strokeWidth="0.7" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="currentColor" strokeWidth="0.7" />
          <circle cx="0" cy="0" r="1.2" fill="currentColor" />
        </g>

        {/* Zubenelgenubi (Alpha Librae) - Southern Claw Star */}
        <g transform="translate(78, 28)">
          <line x1="-3" y1="0" x2="3" y2="0" stroke="currentColor" strokeWidth="0.7" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="currentColor" strokeWidth="0.7" />
          <circle cx="0" cy="0" r="1.2" fill="currentColor" />
        </g>

        {/* Brachium (Sigma Librae) */}
        <circle cx="60" cy="88" r="1" fill="currentColor" strokeOpacity="0.6" />

        {/* Constellation Connection Rays */}
        <line x1="42" y1="28" x2="60" y2="22" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.5 2" strokeOpacity="0.3" />
        <line x1="78" y1="28" x2="60" y2="22" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.5 2" strokeOpacity="0.3" />

        {/* Ancient Libra Astrological Sign (♎ - The Universal Symbol of Balance) */}
        <g transform="translate(60, 96)">
          {/* Top Arch */}
          <path d="M-7 0H-3C-3 -4 3 -4 3 0H7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          {/* Bottom Bar */}
          <line x1="-7" y1="3.5" x2="7" y2="3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </g>

        {/* Universal Harmonic Coordinates Stamp */}
        <circle cx="20" cy="94" r="0.8" fill="currentColor" strokeOpacity="0.4" />
        <circle cx="100" cy="94" r="0.8" fill="currentColor" strokeOpacity="0.4" />
      </svg>
    )
  },

  // October: Fan-Shaped Ginkgo Biloba Leaves & Autumn Wind
  9: {
    name: "October",
    theme: "Ginkgo Biloba & Autumn Wind",
    render: (className = "w-32 h-32") => (
      <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.25" />
        
        {/* Dynamic Gusting Autumn Wind Lines */}
        <path d="M20 44C36 30 64 30 84 40C94 46 94 56 84 62C72 68 58 64 52 70C46 76 50 86 62 90" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.35" strokeLinecap="round" />

        {/* Primary Fan-Shaped Ginkgo Leaf */}
        <g transform="translate(56, 32)">
          {/* Slender Curved Petiole Stem */}
          <path d="M0 62C0 46 -2 32 -4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          {/* Characteristic Bilobed Fan Blade */}
          <path d="M-4 20C-24 14 -32 -2 -18 -16C-8 -24 -2 -16 -4 -12C-6 -8 0 -4 -4 20Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M-4 20C16 14 24 -2 10 -16C0 -24 -6 -16 -4 -12C-2 -8 -8 -4 -4 20Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          {/* Fine Bifurcating Veins Radiating from Petiole Base */}
          <path d="M-4 18C-14 10 -18 2 -14 -8" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5" />
          <path d="M-4 18C-8 6 -10 -4 -4 -12" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5" />
          <path d="M-4 18C4 6 6 -4 0 -12" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5" />
          <path d="M-4 18C14 10 18 2 14 -8" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5" />
        </g>

        {/* Smaller Drifting Secondary Ginkgo Leaf */}
        <g transform="translate(82, 70) rotate(42)">
          <path d="M0 38C0 28 -2 20 -3 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M-3 12C-16 8 -20 -2 -10 -10C-4 -14 0 -8 -3 -6C-2 -8 4 -14 10 -10C20 -2 16 8 -3 12Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
          <line x1="-3" y1="10" x2="-8" y2="-4" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.5" />
          <line x1="-3" y1="10" x2="6" y2="-4" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.5" />
        </g>

        {/* Small Autumn Seeds / Droplets */}
        <circle cx="36" cy="62" r="1.2" fill="currentColor" />
        <circle cx="44" cy="74" r="0.8" fill="currentColor" />
      </svg>
    )
  },

  // November: Silver Birch Trunks & Late Autumn Frost
  10: {
    name: "November",
    theme: "Silver Birch & First Frost",
    render: (className = "w-32 h-32") => (
      <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.25" />
        
        {/* Silver Birch Trunks with Characteristic Lenticels */}
        {/* Main Tree Trunk */}
        <path d="M50 16V98M58 16V98" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M50 28H54M55 36H58M50 46H56M52 58H58M50 70H55M53 82H58" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />

        {/* Slender Companion Birch Trunk */}
        <path d="M72 26V98M78 26V98" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M72 34H75M74 48H78M72 62H76M75 78H78" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />

        {/* Delicate Bare Twigs & Pendants */}
        <path d="M50 42C42 40 34 32 30 24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M38 34C34 38 30 40 26 42" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M58 52C66 48 70 42 72 36" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M78 50C86 46 94 48 98 42" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />

        {/* Solitary Lingering Late Autumn Leaf */}
        <path d="M30 24C28 20 32 16 36 18C38 22 34 26 30 24Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="0.9" />

        {/* Crystalline Frost Ground Base */}
        <line x1="20" y1="98" x2="100" y2="98" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5" />
        <line x1="32" y1="98" x2="34" y2="93" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.6" />
        <line x1="64" y1="98" x2="66" y2="92" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.6" />
        <line x1="88" y1="98" x2="86" y2="94" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.6" />
      </svg>
    )
  },

  // December: Botanical Winter Evergreen Fir (Abies) & Solstice Star
  11: {
    name: "December",
    theme: "Evergreen Solstice & Winter Star",
    render: (className = "w-32 h-32") => (
      <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="48" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.25" />
        
        {/* Luminous Winter Solstice Polaris Star */}
        <g transform="translate(60, 26)">
          <path d="M0 -10L2 -3L9 0L2 3L0 10L-2 3L-9 0L-2 -3Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          <circle cx="0" cy="0" r="1.5" fill="currentColor" />
        </g>

        {/* Central Evergreen Conifer Fir Branch */}
        <line x1="60" y1="44" x2="60" y2="98" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

        {/* Tiered Layered Needle Tufts */}
        {[50, 62, 74, 86].map((y, i) => (
          <g key={i}>
            {/* Left Fir Needles */}
            <path d={`M60 ${y}C50 ${y - 4} 40 ${y + 2} 32 ${y + 8}`} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d={`M56 ${y - 1}C48 ${y - 6} 42 ${y - 2} 36 ${y + 4}`} stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
            <path d={`M58 ${y + 3}C50 ${y} 44 ${y + 6} 38 ${y + 11}`} stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.6" />
            {/* Right Fir Needles */}
            <path d={`M60 ${y}C70 ${y - 4} 80 ${y + 2} 88 ${y + 8}`} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d={`M64 ${y - 1}C72 ${y - 6} 78 ${y - 2} 84 ${y + 4}`} stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
            <path d={`M62 ${y + 3}C70 ${y} 76 ${y + 6} 82 ${y + 11}`} stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.6" />
          </g>
        ))}

        {/* Botanical Hanging Woody Pinecone */}
        <g transform="translate(60, 68)">
          <path d="M0 0C-6 4 -8 16 0 22C8 16 6 4 0 0Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          {/* Overlapping Pinecone Scales Pattern */}
          <path d="M-4 6C0 8 0 8 4 6M-6 11C0 14 0 14 6 11M-4 16C0 18 0 18 4 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Snow Dusting Base Line */}
        <line x1="24" y1="98" x2="96" y2="98" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5" />
      </svg>
    )
  }
};
