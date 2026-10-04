import React from 'react';
import cloud from '@/assets/cloud.png';
import mailCarrier from '@/assets/3d/3D_Mail_Carrier_Art.png';
import rocket from '@/assets/3d/Cartoon_Rocket_Launch.png';
import humanoid from '@/assets/3d/Abstract_3D_Humanoid_Art.png';
import gradientFigure from '@/assets/3d/Dynamic_Gradient_Figure.png';

const AssetShowcase = () => {
  const assets = [
    { src: mailCarrier, alt: 'Mail Carrier' },
    { src: rocket, alt: 'Rocket Launch' },
    { src: humanoid, alt: 'Humanoid Art' },
    { src: gradientFigure, alt: 'Gradient Figure' },
  ];

  return (
    <section className="asset-showcase">
      <div className="asset-showcase-container">
        <div className="asset-showcase-cloud">
          <div className="asset-card cloud-card">
            <img src={cloud} alt="Cloud with arrows" />
          </div>
        </div>
        <div className="asset-showcase-3d">
          <div className="assets-grid">
            {assets.map((asset, i) => (
              <div key={i} className="asset-card">
                <img src={asset.src} alt={asset.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssetShowcase;