import React, { useEffect, useState } from "react";

import UserProfile from "@/components/custom/UserProfile";
import PropertyList from "@/components/custom/PropertyList";

import { useToast } from "@/components/ui/use-toast";
import { isAuthenticated, getUsername, removeCookie } from "@/utils/auth";
// import {
//   Bell,
//   CircleUser,
//   Home,
//   LineChart,
//   Menu,
//   Package,
//   Package2,
//   Search,
//   ShoppingCart,
//   Users,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Dashboard = () => {
  const { toast } = useToast();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      setUsername(getUsername() || "User");
    } else {
      // Redirect to login page if not authenticated
      window.location.href = "/auth/login";
    }
  }, []);

  const handleLogout = () => {
    // Clear cookies
    removeCookie("access_token");
    removeCookie("user_id");
    removeCookie("username");

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });

    // Redirect to home page
    window.location.href = "/";
  };

  //   return (
  //     <div className="container p-6 mx-auto mt-10 bg-white rounded-lg shadow-md dark:bg-gray-800">
  //       <h1 className="mb-4 text-2xl font-bold dark:text-white">Dashboard</h1>
  //       <p className="mb-4 dark:text-gray-300">
  //         Welcome, {username}! Here you can manage your account and view your
  //         data.
  //       </p>
  //       <Button onClick={handleLogout} variant="destructive">
  //         Logout
  //       </Button>

  //       <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
  //         <div className="hidden border-r bg-muted/40 md:block">
  //           <div className="flex flex-col h-full max-h-screen gap-2">
  //             <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
  //               <a
  //                 href="/"
  //                 className="flex items-center gap-2 font-semibold dark:text-slate-200"
  //               >
  //                 <Package2 className="w-6 h-6" />
  //                 <span className="dark:text-slate-200">Acme Inc</span>
  //               </a>
  //               <Button
  //                 variant="outline"
  //                 size="icon"
  //                 className="w-8 h-8 ml-auto dark:text-slate-200"
  //               >
  //                 <Bell className="w-4 h-4" />
  //                 <span className="sr-only">Toggle notifications</span>
  //               </Button>
  //             </div>
  //             <div className="flex-1">
  //               <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
  //                 <a
  //                   href="#"
  //                   className="flex items-center gap-3 px-3 py-2 transition-all rounded-lg text-muted-foreground hover:text-primary dark:text-slate-200"
  //                 >
  //                   <Home className="w-4 h-4 " />
  //                   Dashboard
  //                 </a>
  //                 <a
  //                   href="#"
  //                   className="flex items-center gap-3 px-3 py-2 transition-all rounded-lg text-muted-foreground hover:text-primary dark:text-slate-200"
  //                 >
  //                   <ShoppingCart className="w-4 h-4" />
  //                   Orders
  //                   <Badge className="flex items-center justify-center w-6 h-6 ml-auto rounded-full shrink-0">
  //                     6
  //                   </Badge>
  //                 </a>
  //                 <a
  //                   href="#"
  //                   className="flex items-center gap-3 px-3 py-2 transition-all rounded-lg bg-muted text-primary hover:text-primary dark:text-slate-200"
  //                 >
  //                   <Package className="w-4 h-4" />
  //                   Products{" "}
  //                 </a>
  //                 <a
  //                   href="#"
  //                   className="flex items-center gap-3 px-3 py-2 transition-all rounded-lg text-muted-foreground hover:text-primary dark:text-slate-200"
  //                 >
  //                   <Users className="w-4 h-4" />
  //                   Customers
  //                 </a>
  //                 <a
  //                   href="#"
  //                   className="flex items-center gap-3 px-3 py-2 transition-all rounded-lg text-muted-foreground hover:text-primary dark:text-slate-200"
  //                 >
  //                   <LineChart className="w-4 h-4" />
  //                   Analytics
  //                 </a>
  //               </nav>
  //             </div>
  //             <div className="p-4 mt-auto">
  //               <Card x-chunk="dashboard-02-chunk-0">
  //                 <CardHeader className="p-2 pt-0 md:p-4">
  //                   <CardTitle>Upgrade to Pro</CardTitle>
  //                   <CardDescription>
  //                     Unlock all features and get unlimited access to our support
  //                     team.
  //                   </CardDescription>
  //                 </CardHeader>
  //                 <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
  //                   <Button size="sm" className="w-full">
  //                     Upgrade
  //                   </Button>
  //                 </CardContent>
  //               </Card>
  //             </div>
  //           </div>
  //         </div>
  //         <div className="flex flex-col">
  //           <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
  //             <Sheet>
  //               <SheetTrigger asChild>
  //                 <Button
  //                   variant="outline"
  //                   size="icon"
  //                   className="shrink-0 md:hidden"
  //                 >
  //                   <Menu className="w-5 h-5" />
  //                   <span className="sr-only">Toggle navigation menu</span>
  //                 </Button>
  //               </SheetTrigger>
  //               <SheetContent side="left" className="flex flex-col">
  //                 <nav className="grid gap-2 text-lg font-medium">
  //                   <a
  //                     href="#"
  //                     className="flex items-center gap-2 text-lg font-semibold"
  //                   >
  //                     <Package2 className="w-6 h-6" />
  //                     <span className="sr-only">Acme Inc</span>
  //                   </a>
  //                   <a
  //                     href="#"
  //                     className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
  //                   >
  //                     <Home className="w-5 h-5" />
  //                     Dashboard
  //                   </a>
  //                   <a
  //                     href="#"
  //                     className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
  //                   >
  //                     <ShoppingCart className="w-5 h-5" />
  //                     Orders
  //                     <Badge className="flex items-center justify-center w-6 h-6 ml-auto rounded-full shrink-0">
  //                       6
  //                     </Badge>
  //                   </a>
  //                   <a
  //                     href="#"
  //                     className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
  //                   >
  //                     <Package className="w-5 h-5" />
  //                     Products
  //                   </a>
  //                   <a
  //                     href="#"
  //                     className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
  //                   >
  //                     <Users className="w-5 h-5" />
  //                     Customers
  //                   </a>
  //                   <a
  //                     href="#"
  //                     className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
  //                   >
  //                     <LineChart className="w-5 h-5" />
  //                     Analytics
  //                   </a>
  //                 </nav>
  //                 <div className="mt-auto">
  //                   <Card>
  //                     <CardHeader>
  //                       <CardTitle>Upgrade to Pro</CardTitle>
  //                       <CardDescription>
  //                         Unlock all features and get unlimited access to our
  //                         support team.
  //                       </CardDescription>
  //                     </CardHeader>
  //                     <CardContent>
  //                       <Button size="sm" className="w-full">
  //                         Upgrade
  //                       </Button>
  //                     </CardContent>
  //                   </Card>
  //                 </div>
  //               </SheetContent>
  //             </Sheet>
  //             <div className="flex-1 w-full">
  //               <form>
  //                 <div className="relative">
  //                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
  //                   <Input
  //                     type="search"
  //                     placeholder="Search products..."
  //                     className="w-full pl-8 shadow-none appearance-none bg-background md:w-2/3 lg:w-1/3"
  //                   />
  //                 </div>
  //               </form>
  //             </div>
  //             <DropdownMenu>
  //               <DropdownMenuTrigger asChild>
  //                 <Button
  //                   variant="secondary"
  //                   size="icon"
  //                   className="rounded-full"
  //                 >
  //                   <CircleUser className="w-5 h-5" />
  //                   <span className="sr-only">Toggle user menu</span>
  //                 </Button>
  //               </DropdownMenuTrigger>
  //               <DropdownMenuContent align="end">
  //                 <DropdownMenuLabel>My Account</DropdownMenuLabel>
  //                 <DropdownMenuSeparator />
  //                 <DropdownMenuItem>Settings</DropdownMenuItem>
  //                 <DropdownMenuItem>Support</DropdownMenuItem>
  //                 <DropdownMenuSeparator />
  //                 <DropdownMenuItem>Logout</DropdownMenuItem>
  //               </DropdownMenuContent>
  //             </DropdownMenu>
  //           </header>
  //           <main className="flex flex-col flex-1 gap-4 p-4 lg:gap-6 lg:p-6">
  //             <div className="flex items-center">
  //               <h1 className="text-lg font-semibold md:text-2xl dark:text-slate-200">
  //                 Inventory
  //               </h1>
  //             </div>
  //             <div
  //               className="flex items-center justify-center flex-1 border border-dashed rounded-lg shadow-sm"
  //               x-chunk="dashboard-02-chunk-1"
  //             >
  //               <div className="flex flex-col items-center gap-1 text-center">
  //                 <h3 className="text-2xl font-bold tracking-tight dark:text-slate-100">
  //                   You have no products
  //                 </h3>
  //                 <p className="text-sm text-muted-foreground dark:text-slate-200">
  //                   You can start selling as soon as you add a product.
  //                 </p>
  //                 <Button className="mt-4 bg-green-500 dark:bg-green-500">
  //                   Add Product
  //                 </Button>
  //               </div>
  //             </div>
  //           </main>
  //         </div>
  //       </div>
  //     </div>

  //     // Add your dashboard components here
  //   );
  // };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <UserProfile
          user={{
            name: username,
            email: "",
            role: "",
            profile: {
              first_name: null,
              last_name: null,
              phone: null,
              whatsapp: null,
              company_name: null,
              avatar: null,
              biodata_company: null,
              jobdesk: null,
            },
          }}
        />
        <PropertyList properties={[]} />
      </div>
    </div>
  );
};

export default Dashboard;
