import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Terminal } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import DrawerComment from "./teacher/DrawerComment";
import { postToFirebase } from "../../helper";
import { hostname } from "../../config";
import { dateoptions } from "../../helper";

export default function StudentHome() {
  const [searchParams] = useSearchParams();
  const [checkinCode, setCheckinCode] = useState("");
  const [user, setUser] = useState(null);
  const [stddata, setStddata] = useState(null);
  const [roomdata, setRoomdata] = useState(null);
  const [haveroom, setHaveroom] = useState(null);
  const [qanda, setQanda] = useState(false);

  const handleCheckin = async () => {
    let q = query(collection(db, "checkin"), where("id", "==", checkinCode));
    const querySnapshot = await getDocs(q);
    if (!stddata) {
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          let room = doc.data();
          let checked = room.checked ? room.checked : [];
          let data = postToFirebase({
            std_id: "unknown",
            name: user.displayName,
            checked_date: new Date(),
          });
          checked.push(data);
          updateDoc(doc.ref, { checked })
            .then(() => {
              console.log("Document successfully updated!");
              setRoomdata(room);
              setHaveroom(true);
            })
            .catch((error) => {
              setHaveroom(false);
              console.error("Error updating document: ", error);
            });
        }
      });
      if (querySnapshot.size === 0) {
        setHaveroom(false);
      }
      return;
    }
    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        let room = doc.data();
        let std = stddata;
        let checked = room.checked ? room.checked : [];
        let data = postToFirebase({
          std_id: std.id,
          name: std.name,
          checked_date: new Date(),
        });
        checked.push(data);
        updateDoc(doc.ref, { checked })
          .then(() => {
            console.log("Document successfully updated!");
            setRoomdata(room);
            setHaveroom(true);
          })
          .catch((error) => {
            setHaveroom(false);
            console.error("Error updating document: ", error);
          });
      }
    });
    if (querySnapshot.size === 0) {
      setHaveroom(false);
    }
  };

  const handleCheckinWithQR = async () => {
    let q = query(collection(db, "checkin"), where("id", "==", checkinCode));
    const querySnapshot = await getDocs(q);
    if (!stddata) {
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          let room = doc.data();
          let checked = room.checked ? room.checked : [];
          let data = postToFirebase({
            std_id: "unknown",
            name: user.displayName,
            checked_date: new Date(),
          });
          checked.push(data);
          updateDoc(doc.ref, { checked })
            .then(() => {
              console.log("Document successfully updated!");
              setRoomdata(room);
              setHaveroom(true);
              clearCheckinParams();
            })
            .catch((error) => {
              setHaveroom(false);
              console.error("Error updating document: ", error);
            });
        }
      });
      if (querySnapshot.size === 0) {
        setHaveroom(false);
      }
      return;
    }
    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        let room = doc.data();
        let std = stddata;
        let checked = room.checked ? room.checked : [];
        let data = postToFirebase({
          std_id: std.id,
          name: std.name,
          checked_date: new Date(),
        });
        checked.push(data);
        updateDoc(doc.ref, { checked })
          .then(() => {
            console.log("Document successfully updated!");
            setRoomdata(room);
            setHaveroom(true);
            clearCheckinParams();
          })
          .catch((error) => {
            setHaveroom(false);
            console.error("Error updating document: ", error);
          });
      }
    });
    if (querySnapshot.size === 0) {
      setHaveroom(false);
    }
  };

  const handlecheckroom = async (code) => {
    let q = query(collection(db, "checkin"), where("id", "==", code));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        setQanda(true);
      }
    });
    if (querySnapshot.size === 0) {
      setHaveroom(false);
    }
  };

  const clearCheckinParams = () => {
    if (searchParams.has("checkin")) {
      searchParams.delete("checkin");
      window.history.replaceState({}, "", `${hostname}`);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        let q = query(
          collection(db, "students"),
          where("email", "==", user.email)
        );
        getDocs(q)
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              setStddata(doc.data());
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
      }
    });
  }, []);

  useEffect(() => {
    if (stddata && checkinCode) {
      handleCheckinWithQR();
    }
  }, [checkinCode, stddata]);

  return (
    <div id="picback"
      className="min-h-dvh p-4"
      style={{
        // backgroundImage: `url('https://sc.kku.ac.th/wp-content/uploads/2023/05/7R6A4341-scaled.jpg')`,
        backgroundSize: "cover",
        backgroundSize: "contain",
      }}
    >
    
        <h1 className="mb-4 text-center text-lg font-bold">
          สำหรับนักเรียน/นักศึกษา
        </h1>
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:justify-center md:items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                style={{
                  backgroundColor: "#001A99",
                  color: "#FFFFFF", // White text color
                }}
              >
                เช็คชื่อเข้าเรียน
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>เช็คชื่อ</DialogTitle>
                <DialogDescription>
                  กรุณากรอกรหัสห้องเรียนที่ได้จากครู/อาจารย์
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right col-span-1">
                    รหัสห้อง
                  </Label>
                  <Input
                    id="code"
                    defaultValue=""
                    className="col-span-3"
                    onChange={(e) => setCheckinCode(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" onClick={handleCheckin}>
                    เช็คชื่อ
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
       
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline"
            style={{
              backgroundColor: "#FFC107",
              color: "#000000", // White text color
            }}>ถาม-ตอบ</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>ถาม-ตอบ</DialogTitle>
              <DialogDescription>
                กรุณากรอกรหัสห้องเรียนที่ได้จากครู/อาจารย์
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="qrcode" className="text-right col-span-1">
                  รหัสห้อง
                </Label>
                <Input
                  id="qrcode"
                  defaultValue=""
                  className="col-span-3"
                  onChange={(e) => {
                    setCheckinCode(e.target.value);
                    handlecheckroom(e.target.value);
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                {qanda && <DrawerComment roomId={checkinCode} />}
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {haveroom ? (
        <div className="mb-4">
          <Alert variant="success">
            <Terminal className="h-4 w-4 inline mr-2" />
            <AlertTitle>เช็คชื่อสำเร็จ</AlertTitle>
            <AlertDescription>
              ขอบคุณที่เข้าเรียน วิชา {roomdata.subject} ห้อง {roomdata.room}{" "}
              วันที่{" "}
              {new Date()
                .toLocaleDateString("en-US", dateoptions)
                .replace(/(\d+)\/(\d+)\/(\d+)/, "$2/$1/$3")}{" "}
              เข้าเรียนเวลา{" "}
              {new Date().toLocaleTimeString("en-US", { hour12: false })} น.
              สอนโดย {roomdata.teacher_name}
            </AlertDescription>
          </Alert>
          <DrawerComment roomId={roomdata.id} />
        </div>
      ) : (
        haveroom === false && (
          <div className="mb-4">
            <Alert variant="destructive">
              <Terminal className="h-4 w-4 inline mr-2" />
              <AlertTitle>เช็คชื่อไม่สำเร็จ</AlertTitle>
              <AlertDescription>
                กรุณาตรวจสอบรหัสห้องและลองใหม่อีกครั้ง
              </AlertDescription>
            </Alert>
          </div>
        )
      )}
    </div>
  );
}
