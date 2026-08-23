[1mdiff --git a/app/scan.tsx b/app/scan.tsx[m
[1mindex d9a8bc6..bbd337b 100644[m
[1m--- a/app/scan.tsx[m
[1m+++ b/app/scan.tsx[m
[36m@@ -37,6 +37,7 @@[m [mexport default function ScanScreen() {[m
   const router = useRouter();[m
   const colors = useAppColors();[m
   const cameraRef = useRef<CameraView>(null);[m
[32m+[m[32m  const scanInProgressRef = useRef(false);[m
   const { user } = useAuth();[m
   const {[m
     remainingScans,[m
[36m@@ -224,6 +225,13 @@[m [mexport default function ScanScreen() {[m
       }, 30);[m
     });[m
   const onScan = async () => {[m
[32m+[m[32m    if (scanInProgressRef.current) {[m
[32m+[m[32m      console.log("SCAN: blocked — scan already in progress");[m
[32m+[m[32m      return;[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    scanInProgressRef.current = true;[m
[32m+[m
     console.log("SCAN: onScan started");[m
     if (!user) {[m
       Alert.alert([m
[36m@@ -285,6 +293,11 @@[m [mexport default function ScanScreen() {[m
         hasUri: Boolean(photo?.uri),[m
       });[m
 [m
[32m+[m[32m      console.log("SCAN: captured image size", {[m
[32m+[m[32m        base64Length: photo?.base64?.length ?? 0,[m
[32m+[m[32m        uri: photo?.uri,[m
[32m+[m[32m      });[m
[32m+[m
       if (!photo?.base64) {[m
         throw new Error("Failed to capture image.");[m
       }[m
[36m@@ -507,6 +520,11 @@[m [mUse exactly this structure:[m
           hasMessage: Boolean(response.message),[m
           error: response.error,[m
         });[m
[32m+[m[32m        if (!response.success) {[m
[32m+[m[32m          throw new Error([m
[32m+[m[32m            response.error || "The AI service could not identify the fish.",[m
[32m+[m[32m          );[m
[32m+[m[32m        }[m
 [m
         return response;[m
       });[m
[36m@@ -610,6 +628,9 @@[m [mUse exactly this structure:[m
       }[m
 [m
       setScanState("error");[m
[32m+[m[32m    } finally {[m
[32m+[m[32m      scanInProgressRef.current = false;[m
[32m+[m[32m      console.log("SCAN: scan lock released");[m
     }[m
   };[m
 [m
