# .gitignore file was not ignoring many android build files

Solution:

- First commit any outstanding code changes, and then, run this command

git rm -r --cached .

This removes any changed files from the index(staging area), then just run -

git add .

Commit it -

git commit -m ".gitignore is now working"

Refer: https://stackoverflow.com/questions/36498234/gitignore-not-ignoring-some-build-files-in-android-library

# In iOS there is a white screen which comes right after the splash screen and just before the app loads

Solution:

The full solution is to add the following code to AppDelegate.m

Place this code after "[self.window makeKeyAndVisible]" and before "return YES;"

UIView\* launchScreenView = [[[NSBundle mainBundle] loadNibNamed:@"LaunchScreen" owner:self options:nil] objectAtIndex:0];
launchScreenView.frame = self.window.bounds;
rootView.loadingView = launchScreenView;

Refer: https://stackoverflow.com/questions/51644094/react-native-white-flash-after-splash-screen-on-ios-official-solution-not-worki
