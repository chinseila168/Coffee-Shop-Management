import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { Hero } from './components/website/Hero';
import { FeaturedMenu } from './components/website/FeaturedMenu';
import {
  PromotionsSection,
  AboutSection,
  LocationsSection,
  ReviewsSection,
  NewsletterSection,
} from './components/website/WebsiteSections';
import { ProductCustomizerModal } from './components/website/ProductCustomizerModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackerModal } from './components/customer/OrderTrackerModal';
import { CustomerPortalModal, NotificationsDrawer } from './components/customer/CustomerPortalModal';
import { MobileAppSimulator } from './components/mobile/MobileAppSimulator';
import { AdminLayout } from './components/admin/AdminLayout';

const MainAppContent: React.FC = () => {
  const {
    platformView,
    customizingProduct,
    setCustomizingProduct,
  } = useApp();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCustomerProfileOpen, setIsCustomerProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans selection:bg-[#C89B6D] selection:text-white">
      {/* Toast notifications container */}
      <ToastContainer />

      {/* Main Switcher View */}
      {platformView === 'admin_dashboard' ? (
        <AdminLayout />
      ) : (
        <>
          <Header
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenCustomerProfile={() => setIsCustomerProfileOpen(true)}
            onNavigateSection={id => {
              const el = document.getElementById(id);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {platformView === 'mobile_app' ? (
            <main className="flex-1">
              <MobileAppSimulator
                onCustomizeProduct={p => setCustomizingProduct(p)}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
              />
            </main>
          ) : (
            <main className="flex-1">
              <Hero
                onOrderNowClick={scrollToMenu}
                onExploreMenuClick={scrollToMenu}
              />
              <FeaturedMenu
                onCustomizeProduct={p => setCustomizingProduct(p)}
              />
              <PromotionsSection />
              <AboutSection />
              <LocationsSection />
              <ReviewsSection />
              <NewsletterSection />
            </main>
          )}

          <Footer />
        </>
      )}

      {/* Modals & Slide-overs */}
      <ProductCustomizerModal
        product={customizingProduct}
        onClose={() => setCustomizingProduct(null)}
      />

      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <OrderTrackerModal />

      <CustomerPortalModal
        isOpen={isCustomerProfileOpen}
        onClose={() => setIsCustomerProfileOpen(false)}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
