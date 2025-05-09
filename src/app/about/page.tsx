// src/app/about/page.tsx
export const metadata = { title: "About • RoomSync Lite" };

export default function AboutPage() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16 space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-semibold mb-6">About Us</h1> 
        <p className="text-lg text-gray-600">
          RoomSync Lite helps you match with roommates that fit your lifestyle
        </p>
      </header>

      <article className="prose prose-slate max-w-none space-y-8"> 
        <div> 
          <h2 className="text-2xl font-semibold mb-4">How it works:</h2>
          <ol className="list-decimal pl-5 space-y-2"> 
            <li><strong>Create a profile</strong> – tell us about your habits and preferences.</li>
            <li><strong>Browse matches</strong> – our compatibility score highlights the best fits.</li>
            <li><strong>Connect</strong> – like someone to swap contact info when the feeling is mutual.</li>
          </ol>
        </div>

        <div> 
          <h2 className="text-2xl font-semibold mb-4">Roles</h2> 
          <ul className="list-disc pl-5 space-y-2">
            <li><b className="font-bold text-lg">Looking</b> - searching for a room.</li>
            <li><b className="font-bold text-lg">Offering</b> - have a spare room to fill.</li>
            <li><b className="font-bold text-lg">Browsing</b> - just exploring; contact is optional.</li>
          </ul>
        </div>

        <div className="">
          <h2 className="text-2xl font-semibold mb-4">Compatibility Score</h2> 
          <p className="text-lg mb-8"> 
            We compare cleanliness, noise tolerance, sleep schedule and age. A perfect
            match scores <code className="font-semibold">10.0</code>; higher is better. Details are always visible by hovering
            the info icon in the <em>Browse</em> table.
          </p>
        </div>
        
      </article>

      <footer className="text-center text-sm text-gray-500 mt-12"> 
        © 2025 RoomSync Lite - Built for CS 5356 @ Cornell Tech
      </footer>
    </section>
  );
}