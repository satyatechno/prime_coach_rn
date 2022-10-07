import React from "react";
import { StatusBar } from "react-native";
import AppNavigator from "./app/navigations/AppNavigator";
import { RootSiblingParent } from "react-native-root-siblings";
import OneSignal from "react-native-onesignal";
import { setTopLevelNavigator } from "./app/utils/Navigation";
import VersionCheck from "react-native-version-check";
StatusBar.setBackgroundColor("rgba(18, 18, 18,1)");
StatusBar.setBarStyle("light-content", true);

export default class App extends React.Component {
  async componentDidMount() {
    // const getAppVersion = async () => {
    //   try {
    //     console.log("current", VersionCheck.getCurrentVersion()); // 0.1.1

    //     const res = await VersionCheck.needUpdate();
    //     console.log("eeeee", res);
    //   } catch (e) {
    //     console.log("errorrrr===>", e);
    //   }
    // };
    // getAppVersion();

    OneSignal.setAppId("82e30463-0d83-4576-9fbb-5438eec0cb42");
    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    // OneSignal.promptForPushNotificationsWithUserResponse((response) => {
    //   console.log('Prompt response:', response);
    // });

    OneSignal.setNotificationWillShowInForegroundHandler(
      (notifReceivedEvent) => {
        console.log(
          "OneSignal: notification will show in foreground:",
          notifReceivedEvent
        );
      }
    );
    // OneSignal.setNotificationOpenedHandler((notification) => {
    //   console.log('OneSignal: notification opened:', notification);
    // });
    // OneSignal.setInAppMessageClickHandler((event) => {
    //   console.log('OneSignal IAM clicked:', event);
    // });
    // OneSignal.addEmailSubscriptionObserver((event) => {
    //   console.log('OneSignal: email subscription changed: ', event);
    // });
    // OneSignal.addSubscriptionObserver((event) => {
    //   console.log('OneSignal: subscription changed:', event);
    //   this.setState({ isSubscribed: event.to.isSubscribed });
    // });
    // OneSignal.addPermissionObserver((event) => {
    //   console.log('OneSignal: permission changed:', event);
    // });

    const deviceState = await OneSignal.getDeviceState();

    // console.log('Devise state', deviceState);
  }

  render() {
    return (
      <RootSiblingParent>
        <AppNavigator
          ref={(navigatorRef) => {
            setTopLevelNavigator(navigatorRef);
          }}
        />
      </RootSiblingParent>
    );
  }
}

// OneSignal App ID: 82e30463-0d83-4576-9fbb-5438eec0cb42
