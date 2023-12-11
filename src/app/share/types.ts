import { FormControl } from '@angular/forms';

//data base
export interface Base<T> {
  success: boolean;
  code: number;
  locale: string;
  message: string;
  data: T;
  debug?: string[];
}

export interface User {
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  created_ip: null;
  google_id: number;
  email_verified_at: string;
  icon: null;
  id: number;
  phone: string;
  salt: string;
  status: number;
  updated_at: Date;
  updated_ip: null;
}
export interface ResetPasswordRes {
  datetime: number;
  email: string;
  signature: string;
  token: string;
  url: string;
  user_id: number;
}
export interface Domain {
  id: number;
  store_id: number;
  merchant_id: number;
  subdomain: string;
  host: string;
  created_at: Date;
  updated_at: Date;
}

export interface StoreRes {
  announce: any;
  banner: string;
  business_hour?: BusinessHour[];
  length: number;
  city: string;
  created_at: Date;
  closure: number;
  domain: Domain[];
  email: string;
  email_verified_at: string;
  id: number;
  social_media:any[];
  latitude: string;
  logo: string;
  longitude: string;
  merchant_id: number;
  is_catering:number;
  is_utensil:number;
  optional: string;
  phone: string;
  state: string;
  status: number;
  store_name: string;
  address: string;
  time_zone: any;
  updated_at: Date;
  zipcode: number;
  delivery_distance: DeliveryFee[];
  tips: Tips[];
  tax: Tax[];
  custom_fee: CustomFee[];
  order_type: string;
  minimum_pay: string;
  payment_type: string;
}
export interface OrderType {
  // delivery
  1: boolean;
  // pickup
  2: boolean;
}
export interface MinimumPay {
  // delivery
  1: number;
  // pickup
  2: number;
}
export interface PaymentType {
  // online
  1: boolean;
  // in store
  2: boolean;
}
export interface BusinessHour {
  close_hour: string;
  created_at: Date;
  id: number;
  merchant_id: number;
  open_hour: string;
  scope: string;
  status: number;
  store_id: number;
  type: null;
  updated_at: Date;
}
export interface BusinessHourDetail {
  open_hour: string;
  close_hour: string;
}
export interface Tips {
  created_at: Date;
  id: number;
  merchant_id: number;
  store_id: number;
  value: string;
  name: string;
  updated_at: Date;
}
export interface CustomFee {
  created_at: Date;
  id: number;
  merchant_id: number;
  store_id: number;
  value: number;
  name: string;
  type: number;
  updated_at: Date;
}
export interface Tax {
  created_at: Date;
  id: number;
  merchant_id: number;
  store_id: number;
  tax: string;
  name: string;
  checked?: boolean;
  updated_at: Date;
}
export interface DeliveryFee {
  created_at: Date;
  end_distance: number;
  id: number;
  merchant_id: number;
  start_distance: number;
  status: number;
  store_id: number;
  type: number;
  updated_at: Date;
  value: string;
}
export interface Group {
  categories: Category[];
  created_at: Date;
  id: number;
  merchant_id: number;
  sort: number;
  status: number;
  store_id: number;
  name: string;
  updated_at: Date;
}
export interface Category {
  id: number;
  store_id: number;
  ref_id: number;
  is_dining_time_display: number;
  description: string;
  merchant_id: number;
  group_id: number;
  name: string;
  sort: number;
  status: number;
  created_at: Date;
  updated_at: Date;
  menu_list?: Item[];
  dining_times: DiningTime[];
}
export interface DiningTime {
  close_hour: string;
  created_at: Date;
  id: number;
  merchant_id: number;
  open_hour: string;
  pivot: { dining_id: number; item_id: number };
  scope: string;
  status: number;
  store_id: number;
  type: number;
  updated_at: Date;
}
export interface Item {
  id: number;
  ref_id: number;
  store_id: number;
  name: string;
  price: string;
  menu_type: number;
  item_type: 1;
  tare: 1;
  sort: 1;
  tax?: null;
  is_taxable?: null;
  has_variants?: null;
  is_discountable?: null;
  is_modifiable?: null;
  spicy?: null;
  icon?: string;
  description?: string;
  quantity: number;
  out_of_stock?: number;
  status?: number;
  pivot: ItemPivot;
  menu_item_to_modifies?: MenuModify[];
  menu_item_to_sections?: MenuSectionConnection[];
  menu_item_variants?: MenuVariants[];
  dining_times: DiningTime[];
  is_inventory: number;
  is_recommend: number;
  merchant_id: number;

  created_at: Date;
  updated_at: Date;
}

export interface ItemPivot {
  item_id: number;
  category_id: number;
}

export interface MenuVariants {
  id: number;
  store_id: number;
  item_id: number;
  name: string;
  price: string;
  sort: number;
  quantity?: number;
  created_at: Date;
  updated_at: Date;
}

export interface MenuModify {
  id: number;
  store_id: number;
  item_id: number;
  modify_id: number;
  seleted: number;
  sort: number;
  created_at: Date;
  updated_at: Date;
  // undefined
  menu_modify?: Menu_Modify[];
  quantity?: number | FormControl;
  checked?: boolean;
}
export interface Menu_Modify {
  category_id: number;
  created_at: Date;
  id: number;
  merchant_id: number;
  name: string;
  price: string;
  ref_id: number;
  sort: number;
  status: number;
  store_id: number;
  updated_at: Date;
}
export interface MenuSectionConnection {
  id: number;
  store_id: number;
  item_id: number;
  section_id: number;
  min: number;
  max: number;
  is_duplicate: number;
  is_multiple_select: number;
  sort: number;
  created_at: Date;
  updated_at: Date;
  menu_section: MenuSection;
  selected?: number;
  isMax: boolean;
}

export interface MenuSection {
  id: number;
  store_id: number;
  name: string;
  sort: number;
  min: number;
  max: number;
  // undefined
  repeats: null;
  notes?: null;
  status?: null;
  created_at: Date;
  updated_at: Date;
  menu_section_items: MenuSectionItem[];
  menu_section_modifies: MenuSectionModify[];
}

export interface MenuSectionItem {
  id: number;
  store_id: number;
  item_id: number;
  name?: string;
  section_id: number;
  multiple_select: number;
  price: string;
  price_active: number;
  min: number;
  max: number;
  repeats: number;
  sort: number;
  status: number;
  created_at: string;
  updated_at: string;
  item: Item;
  quantity?: number;
  checked?: boolean;
  itemOrModify?: boolean;
}

export interface MenuSectionModify {
  id: number;
  store_id: number;
  item_id: number;
  section_id: number;
  multiple_select: number;
  name?: string;
  price: string;
  price_active: number;
  min: number;
  max: number;
  repeats: number;
  sort: number;
  status: number;
  created_at: string;
  updated_at: string;
  modify: MenuSectionModifyModify;
  quantity?: number;
  checked?: boolean;
  itemOrModify?: boolean;
}

export interface MenuSectionModifyModify {
  id: number;
  store_id: number;
  category_id: number;
  name: string;
  item_type: number;
  price: string;
  sort: number;
  taxable: number;
  discountable: number;
  print: number;
  status: number;
  icon: string;
  description: null;
  created_at: Date;
  updated_at: Date;
}

export interface ShoppingCartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  unique_id: string;
  options: {
    refId: number;
    expired: boolean;
    itemInstructions: string | null;
    itemModifies: itemModify[];
    itemSections: itemSection[];
    itemVariant: MenuVariants[];
  };
}

export interface ShoppingCartRes {
  cart: ShoppingCartItem[];
  store: StoreRes;
  total: number;
}
export interface itemModify {
  created_at: Date;
  id: number;
  item_id: number;
  modify_id: number;
  name: string;
  price: string;
  quantity: number;
  store_id: number;
  updated_at: Date;
}
export interface itemSection {
  created_at: Date;
  id: number;
  max: number;
  min: number;
  name: string;
  repeats: number;
  sectionItems: MenuSectionItem[];
  sectionModifiers: MenuSectionModify[];
  section_created_at: string;
  section_updated_at: string;
  store_id: number;
  updated_at: Date;
}

export interface UserAddress {
  id?: number;
  user_id: number;
  address: string;
  optional: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
  is_default: number;
  status: number;
  created_at: Date;
  updated_at: Date;
}
export interface OrderSchedule {
  created_at: Date;
  id: number;
  merchant_id: number;
  order_type: number;
  status: number;
  store_id: number;
  updated_at: Date;
  value: string;
}
export interface Checkout {
  cart: ShoppingCartItem[];
  orderSchedule: OrderSchedule;
  orderParams: {
    notes: string;
    orderType: string;
    paymentType: string;
    phone: string;
    scheduleTime: null;
    storeId: string;
    userId: number;
    tips: {
      amount: string;
      id: number;
    };
  };
  cdp: string;
  cdpFees: { total: string; list: ServicesFee[] };
  coupons: Coupon[];
  couponsAmount: string;
  customFees: {
    total: string;
    list: ServicesFee[];
  };
  deliveryFees: string;
  deliveryInfo: {
    code: number;
    message: string;
    user_address: string;
    user_address_id: number;
    user_id: number;
    store_id: string;
    phone: string;
    delivery_fee: string;
    destination_addresses: [string];
    distance: { text: string; value: number };
    duration: { text: string; value: number };
    origin_addresses: [string];
    value: number;
  };
  fees: string;
  feesAmount: string;
  store: StoreRes;
  subtotal: string;
  tax: string;
  tips: string;
  total: string;
}
export interface Coupon {
  name: string;
}
export interface CheckoutReq {
  // delivery_adress: {
  //   address: string;
  //   optional: string;
  //   city: string;
  //   state: string;
  //   zipcode: string;
  // };
  // credit_cart: {
  //   card_number: string;
  //   expriation_date: string;
  //   name: string;
  //   zipcode: string;
  //   cvv: string;
  // };
  notes: string;
  order_type: string;
  payment_type: string;
  delivery_address?: string;
  phone_number: number;
  // store_id: number;
  // tips: string;
}

export interface OrderStatus {
  created_at: Date;
  delivery_address: string;
  discount: string;
  delivery_fee: string;
  details: string;
  fees: string;
  id: number;
  is_paid: number;
  notes: string;
  order_items: OrderItem[];
  order_store: StoreRes;
  order_type: number;
  order_number: string;
  payment_type: 2;
  phone: string;
  status: number;
  store_id: number;
  subtotal: string;
  tax: string;
  tips: string;
  total: string;
  updated_at: string;
  user_id: number;
  cdp: string;
  transaction_id: string;
  ticket_number: number;
}
export interface OrderInfoItem {
  created_at: Date;
  id: number;
  item_id: number;
  item_name: string;
  notes: string;
  options: OrderInfoItemOption[];
  order_id: number;
  price: number;
  quantity: number;
  ref_id: string;
  status: number;
  store_id: string;
  subtotal: number;
  tax: number;
  total: number;
  updated_at: Date;
  user_id: number;
}
export interface OrderInfoItemOption {
  created_at: Date;
  id: number;
  item_id: number;
  item_name: string;
  item_type: number;
  order_id: number;
  parent_id: number;
  price: string;
  quantity: number;
  ref_id: string;
  store_id: string;
  subtotal: number;
  updated_at: Date;
  user_id: number;
}
export interface OrderInfo {
  cdp: number;
  created_at: Date;
  delivery_address: string;
  delivery_fee: number;
  details: string;
  discount: string;
  fees: number;
  id: number;
  is_paid: number;
  item: OrderInfoItem[];
  length: number;
  notes: string;
  order_type: string;
  payment_type: string;
  phone: number;
  status: number;
  store_id: string;
  subtotal: string;
  tax: string;
  tips: string;
  total: string;
  transaction_id: number;
  updated_at: Date;
  user_id: number;
}
export interface OrderItemAdditional {
  created_at: Date;
  id: number;
  item_id: number;
  item_name: string;
  item_type: number;
  order_id: number;
  parent_id: number;
  price: string;
  quantity: number;
  status: number;
  store_id: number;
  subtotal: string;
  updated_at: Date;
  user_id: number;
}
export interface PageBase<T> {
  current_page: number;
  data: T;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}

export interface Link {
  url: string;
  label: string;
  active: boolean;
}
export interface OrderItem {
  created_at: Date;
  discount: string;
  id: number;
  item_id: number;
  item_name: string;
  notes: null;
  order_id: number;
  order_item_additional: OrderItemAdditional[];
  price: string;
  quantity: number;
  sort: number;
  status: number;
  store_id: number;
  subtotal: string;
  tax: string;
  total: string;
  updated_at: Date;
  user_id: number;
}
export interface orderStatus {
  order_type: number;
  payment: number;
}
export interface ServicesFee {
  name: string;
  value: string;
}
export interface DeliveryInfo {
  delivery_fee: string;
  destination_addresses: string[];
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  phone?: string;
  origin_addresses: string[];
  user_address?: string;
  user_address_id?: number;
  store_id: string;
  user_id: number;
  value: number;
}
export interface PlacedOrder {
  amount: string;
  cart: ShoppingCartItem[];
  cdp: string;
  cdpFees: { total: string; list: ServicesFee[] };
  coupons: [];
  couponsAmount: string;
  order: OrderInfo;
  customFees: { total: string; list: ServicesFee[] };
  deliveryFees: string;
  deliveryInfo: DeliveryInfo;
  fees: string;
  feesAmount: string;
  orderId: number;
  orderNumber: string;
  orderParams: {
    notes: string;
    orderType: string;
    paymentType: string;
    phone: number;
    scheduleTime: string;
    storeId: string;
    userId: number;
  };
  store: {
    address: string;
    city: string;
    id: number;
    optional: string;
    phone: string;
    state: string;
    store_name: string;
    zipcode: number;
  };
  subtotal: string;
  tax: string;
  ticketNumber: number;
  tips: string;
  total: string;
}
export interface ScheduleTime {
  id: number;
  merchant_id: number;
  store_id: number;
  order_type: string;
  value: string;
  status: number;
  created_at: Date;
  update_at: Date;
}
