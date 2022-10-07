import { IS_IOS } from '../../../constants/DeviceDetails';

export const ProfileListData = [
  {
    title: 'Name',
    id: 1,
    img: require('../../../img/name.png'),
    pageName: 'EditName',
  },
  {
    title: 'Change Password',
    id: 2,
    img: require('../../../img/password.png'),
    pageName: 'EditPassword',
  },
  {
    title: 'Email',
    id: 3,
    img: require('../../../img/email.png'),
    pageName: 'EditEmail',
  },
  {
    title: 'Coach Specialisation',
    id: 4,
    img: require('../../../img/coach.png'),
    pageName: 'CoachSpcl',
  },
  {
    title: 'Date of Birth',
    id: 5,
    img: require('../../../img/dob.png'),
    pageName: 'EditDOB',
  },
  {
    title: 'Phone Number',
    id: 6,
    img: require('../../../img/phone.png'),
    pageName: 'EditPhone',
  },
  {
    title: 'Address',
    id: 7,
    img: require('../../../img/location.png'),
    pageName: 'EditAddress',
  },
  // {
  //   title: 'Exercise Settings',
  //   id: 20,
  //   img: require('../../../img/coach.png'),
  //   pageName: 'ExerciseSettings',
  // },
  {
    title: 'Privacy Policy',
    id: 8,
    img: require('../../../img/privacy.png'),
    pageName: 'PrivacyPage',
  },
  {
    title: 'Terms & Conditions',
    id: 9,
    img: require('../../../img/terms.png'),
    pageName: 'TermsPage',
  },
  {
    title: 'Frequently asked Questions',
    id: 10,
    img: require('../../../img/faqs.png'),
    pageName: 'FAQsPage',
  },
  // {
  //   title: "Send to a Friend",
  //   id: 11,
  //   img: require("../../../img/share.png"),
  //   pageName: "ReferPage",
  // },
  {
    title: 'Rate Us',
    id: 12,
    img: require('../../../img/rate.png'),
    redirect: true,
    redirectUrl: IS_IOS
      ? 'https://apps.apple.com/us/app/prime-coach/id1529593405'
      : 'https://play.google.com/store/apps/details?id=com.primecoach',
  },
  {
    title: 'Logout',
    id: 13,
    img: require('../../../img/logout.png'),
    pageName: 'Refer',
    isButton: true,
  },
];
