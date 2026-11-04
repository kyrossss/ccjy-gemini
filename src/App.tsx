/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WechatShell } from './components/WechatShell';
import { HeaderNav } from './components/HeaderNav';
import { TabBar, TabKey } from './components/TabBar';
import { HomeView } from './components/views/HomeView';
import { ShopView } from './components/views/ShopView';
import { ConsignView } from './components/views/ConsignView';
import { TeaRoomView } from './components/views/TeaRoomView';
import { MemberView } from './components/views/MemberView';

import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { ConsignmentModal } from './components/ConsignmentModal';
import { ReservationModal } from './components/ReservationModal';
import { PointsRedeemModal } from './components/PointsRedeemModal';
import { DailyTeaRitual } from './components/DailyTeaRitual';
import { BrewingGuideModal } from './components/BrewingGuideModal';
import { NotificationBanner, NotificationData } from './components/NotificationBanner';
import { TeaInvitationModal, BookingInvitationData } from './components/TeaInvitationModal';
import { TeaResumeModal, ResumeTabType } from './components/TeaResumeModal';

import { TeaItem, ConsignmentItem, TeaRoom, PointsItem, CONSIGNMENT_ITEMS } from './data/mockData';
import { TeaWisdomItem } from './data/teaWisdomData';
import { MemberTierLevel, CartItem, calculateTier } from './utils/teaLogic';
import { UserOrderRecord, INITIAL_USER_ORDERS, createOrderRecord } from './utils/orderResumeLogic';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabKey>('home');

  // Member State
  const [userTier, setUserTier] = useState<MemberTierLevel>('MASTER');
  const [leafPoints, setLeafPoints] = useState<number>(6850);
  const [chaTokens, setChaTokens] = useState<number>(320);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  // Cart State
  const [cartItems, setCartItems] = useState<(CartItem & { image?: string })[]>([
    {
      id: 'tea-02',
      name: '丛味百年·老枞水仙',
      price: 980,
      quantity: 1,
      image: '/assets/aistudio/IMG_6489_3dbe7626.JPG',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [recentOrdersCount, setRecentOrdersCount] = useState(2);

  // Consignment List State (user can add to it)
  const [consignments, setConsignments] = useState<ConsignmentItem[]>(CONSIGNMENT_ITEMS);

  // Bookings State
  const [activeBookings, setActiveBookings] = useState<
    {
      id: string;
      roomName: string;
      date: string;
      timeSlot: string;
      guests: number;
      sommelier: string;
      pairedTea: string;
      finalPrice: number;
    }[]
  >([
    {
      id: 'YUN-SEAT-892104',
      roomName: '「月藏」THE MOON\'S SILENT RETREAT',
      date: '2026-11-08',
      timeSlot: '午席 (14:00 - 17:00)',
      guests: 2,
      sommelier: '苏婉',
      pairedTea: '荒野头春白毫银针',
      finalPrice: 612,
    },
  ]);

  // Reservation Calendar Selected Date State
  const [selectedReservationDate, setSelectedReservationDate] = useState<string>('2026-11-08');

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<TeaItem | null>(null);
  const [consignModalState, setConsignModalState] = useState<{
    isOpen: boolean;
    item: ConsignmentItem | null;
    mode: 'view' | 'submit';
  }>({
    isOpen: false,
    item: null,
    mode: 'view',
  });
  const [reservationRoom, setReservationRoom] = useState<TeaRoom | null>(null);
  const [isPointsRedeemOpen, setIsPointsRedeemOpen] = useState(false);
  const [isDailyRitualOpen, setIsDailyRitualOpen] = useState(false);
  const [selectedWisdom, setSelectedWisdom] = useState<TeaWisdomItem | null>(null);
  const [activeNotification, setActiveNotification] = useState<NotificationData | null>(null);
  const [invitationBooking, setInvitationBooking] = useState<BookingInvitationData | null>(null);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);

  // User Orders State (initialized with authentic archival records)
  const [userOrders, setUserOrders] = useState<UserOrderRecord[]>(INITIAL_USER_ORDERS);

  // Resume Modal State
  const [resumeModalState, setResumeModalState] = useState<{
    isOpen: boolean;
    initialTab: ResumeTabType;
  }>({
    isOpen: false,
    initialTab: 'orders',
  });

  // Cart Handlers
  const handleAddToCart = (item: TeaItem, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity, image: item.image }];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckoutSuccess = (orderInfo: {
    total: number;
    pointsEarned: number;
    tokensUsed: number;
    tokensEarned: number;
    itemCount: number;
    orderedItems: (CartItem & { image?: string })[];
  }) => {
    const newOrder = createOrderRecord({
      items: orderInfo.orderedItems.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        image: it.image,
      })),
      total: orderInfo.total,
      pointsEarned: orderInfo.pointsEarned,
      tokensEarned: orderInfo.tokensEarned,
      tokensUsed: orderInfo.tokensUsed,
    });
    setUserOrders((prev) => [newOrder, ...prev]);
    setRecentOrdersCount((prev) => prev + 1);
    setChaTokens((prev) => Math.max(0, prev - orderInfo.tokensUsed + orderInfo.tokensEarned));
    const newPoints = leafPoints + orderInfo.pointsEarned;
    setLeafPoints(newPoints);
    // Recalculate tier dynamically if needed
    const updatedTier = calculateTier(newPoints);
    if (updatedTier.id !== userTier && newPoints >= 20000) {
      setUserTier('YINSHAN');
    }
  };

  // Consignment Submission Handler
  const handleSubmitConsignment = (newItem: ConsignmentItem) => {
    setConsignments((prev) => [newItem, ...prev]);
    // Reward tokens for consignment
    setChaTokens((prev) => prev + Math.floor(newItem.currentPrice / 50));
  };

  // Booking Confirmation Handler
  const handleConfirmBooking = (booking: BookingInvitationData) => {
    setActiveBookings((prev) => [booking, ...prev]);
    setLeafPoints((prev) => prev + Math.floor((booking.finalPrice || 0) * 1.5));
    // Trigger simulated WeChat / iOS push notification
    setActiveNotification({
      id: booking.id,
      title: '春城嘉叶 · 雅席钦定通知',
      message: `您已成功预留「${booking.roomName}」茶席`,
      timestamp: new Date().toLocaleTimeString(),
      roomName: booking.roomName,
      date: booking.date,
      timeSlot: booking.timeSlot,
    });
    setInvitationBooking(booking);
  };

  // Points Redeem Handler
  const handleRedeemPoints = (item: PointsItem, costPoints: number) => {
    setLeafPoints((prev) => Math.max(0, prev - costPoints));
  };

  // Daily Ritual Checkin Handler
  const handleCheckInSuccess = (earnedPoints: number, earnedTokens: number) => {
    setHasCheckedInToday(true);
    setLeafPoints((prev) => prev + earnedPoints);
    setChaTokens((prev) => prev + earnedTokens);
  };

  return (
    <WechatShell activeTab={currentTab}>
      {/* Simulated Local Push Notification Banner */}
      <NotificationBanner
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
        onClick={() => {
          setIsInvitationOpen(true);
          setActiveNotification(null);
        }}
      />

      {/* Sticky Mini Program Header */}
      <HeaderNav
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenRitual={() => setIsDailyRitualOpen(true)}
      />

      {/* Main Tab Destination Views */}
      <main className="flex-1 overflow-y-auto min-h-0 no-scrollbar">
        {currentTab === 'home' && (
          <HomeView
            onSelectTab={setCurrentTab}
            onOpenProduct={(item) => setSelectedProduct(item)}
            onOpenRitual={() => setIsDailyRitualOpen(true)}
            onOpenWisdom={(item) => setSelectedWisdom(item)}
            userTier={userTier}
          />
        )}

        {currentTab === 'shop' && (
          <ShopView
            onOpenProduct={(item) => setSelectedProduct(item)}
            onAddToCart={handleAddToCart}
            userTier={userTier}
          />
        )}

        {currentTab === 'consign' && (
          <ConsignView
            onOpenConsignmentModal={(item, mode) =>
              setConsignModalState({ isOpen: true, item, mode })
            }
            userTier={userTier}
          />
        )}

        {currentTab === 'room' && (
          <TeaRoomView
            onSelectRoom={(room) => setReservationRoom(room)}
            userTier={userTier}
            selectedDate={selectedReservationDate}
            onSelectDate={setSelectedReservationDate}
            onOpenInvitation={(b) => {
              setInvitationBooking(b);
              setIsInvitationOpen(true);
            }}
            activeBookings={activeBookings}
          />
        )}

        {currentTab === 'member' && (
          <MemberView
            userTier={userTier}
            setUserTier={setUserTier}
            leafPoints={leafPoints}
            chaTokens={chaTokens}
            onOpenPointsRedeem={() => setIsPointsRedeemOpen(true)}
            onOpenDailyRitual={() => setIsDailyRitualOpen(true)}
            onOpenConsignmentSubmit={() =>
              setConsignModalState({ isOpen: true, item: null, mode: 'submit' })
            }
            recentOrdersCount={recentOrdersCount}
            activeBookingsCount={activeBookings.length}
            onOpenSalonReservation={() => setCurrentTab('room')}
            onOpenResume={(tab) => setResumeModalState({ isOpen: true, initialTab: tab })}
          />
        )}
      </main>

      {/* Fixed Mini Program Tab Bar */}
      <TabBar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Modals & Drawers */}
      <ProductDetailModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        userTier={userTier}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        userTier={userTier}
        availableTokens={chaTokens}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      <ConsignmentModal
        isOpen={consignModalState.isOpen}
        onClose={() => setConsignModalState({ isOpen: false, item: null, mode: 'view' })}
        selectedItem={consignModalState.item}
        mode={consignModalState.mode}
        userTier={userTier}
        onSubmitConsignment={handleSubmitConsignment}
      />

      <ReservationModal
        isOpen={reservationRoom !== null}
        onClose={() => setReservationRoom(null)}
        room={reservationRoom}
        userTier={userTier}
        initialDate={selectedReservationDate}
        onOpenInvitation={(b) => {
          setInvitationBooking(b);
          setIsInvitationOpen(true);
        }}
        onConfirmBooking={handleConfirmBooking}
      />

      <PointsRedeemModal
        isOpen={isPointsRedeemOpen}
        onClose={() => setIsPointsRedeemOpen(false)}
        leafPoints={leafPoints}
        chaTokens={chaTokens}
        onRedeem={handleRedeemPoints}
      />

      <DailyTeaRitual
        isOpen={isDailyRitualOpen}
        onClose={() => setIsDailyRitualOpen(false)}
        onCheckInSuccess={handleCheckInSuccess}
        hasCheckedInToday={hasCheckedInToday}
      />

      <BrewingGuideModal
        item={selectedWisdom}
        onClose={() => setSelectedWisdom(null)}
        onExploreProducts={() => {
          setSelectedWisdom(null);
          setCurrentTab('shop');
        }}
      />

      {/* Elegant Tea Ceremony Invitation Card Modal with One-Click Calendar Export */}
      <TeaInvitationModal
        booking={invitationBooking}
        isOpen={isInvitationOpen}
        onClose={() => setIsInvitationOpen(false)}
      />

      {/* Tea Resume Archive Modal (Orders, Salon Bookings, and Consignment Heritage) */}
      <TeaResumeModal
        isOpen={resumeModalState.isOpen}
        onClose={() => setResumeModalState((prev) => ({ ...prev, isOpen: false }))}
        initialTab={resumeModalState.initialTab}
        orders={userOrders}
        bookings={activeBookings}
        consignments={consignments.filter((c) => c.sellerName === '当前会员')}
        onOpenInvitation={(b) => {
          setInvitationBooking(b);
          setIsInvitationOpen(true);
        }}
        onOpenConsignmentDetail={(item) => {
          setConsignModalState({ isOpen: true, item, mode: 'view' });
        }}
        onOpenNewConsignment={() => {
          setConsignModalState({ isOpen: true, item: null, mode: 'submit' });
        }}
        onGoToRooms={() => setCurrentTab('room')}
        onGoToShop={() => setCurrentTab('shop')}
      />
    </WechatShell>
  );
}
