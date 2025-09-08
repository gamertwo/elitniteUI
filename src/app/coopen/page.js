
import ElitniteCodePenShowcase from '../productcard/CodePenShowcaseHero';
// import GreenMotiveHero from './ecocard';
export default function Home() {
  return (
    <main className="relative">
   <div className="w-full max-w-none" style={{ 
        transform: 'scale(1)', 
        transformOrigin: 'top left',
        width: '100vw',
        minHeight: '100vh'
      }}>
      {/* <ProductsSection /> */}
      {/* <GreenMotiveHero /> */}
      <ElitniteCodePenShowcase/>
      {/* <CodePenShowcase /> */}</div>

    </main>
  );
}