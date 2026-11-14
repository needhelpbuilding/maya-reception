import type { Metadata } from 'next';
import './globals.css';
import { HospitalProvider } from '@/lib/HospitalContext';
import ReceptionSidebar from '@/components/ReceptionSidebar';
import ReceptionHeader from '@/components/ReceptionHeader';

export const metadata: Metadata = {
  title: 'Receptionist Operations Dashboard | Maya Hospital & Multi Speciality Centre',
  description: 'Central operational console for Maya Hospital reception: doctor schedules, patient check-ins, appointment tracking, admissions, billing, and communication.',
  icons: {
    icon: '/Purple Caduceus Laurel Monogram.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body className="bg-[#fcfafc] min-h-screen">
        <HospitalProvider>
          <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Sidebar */}
            <ReceptionSidebar />

            {/* Main Operational Canvas */}
            <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
              <ReceptionHeader />
              <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-[1600px] w-full mx-auto">
                {children}
              </main>
            </div>
          </div>
        </HospitalProvider>
      </body>
    </html>
  );
}
