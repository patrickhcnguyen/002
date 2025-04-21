import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Calendar, 
  Users, 
  Clock,
  DollarSign,
  Receipt,
  FileBarChart,
  CreditCard
} from "lucide-react";

export function Features() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-accent/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 animate-fade-in">Key Features</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in">
          Everything you need to manage your temporary workforce effectively in one platform
        </p>
        
        <Tabs defaultValue="quotes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-4 bg-transparent h-auto p-0 mb-8">
            <TabsTrigger 
              value="quotes" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-8 py-4"
            >
              <FileText className="mr-2 h-5 w-5" />
              Quotes & Invoicing
            </TabsTrigger>
            <TabsTrigger 
              value="scheduling" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-8 py-4"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Scheduling
            </TabsTrigger>
            <TabsTrigger 
              value="management" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-8 py-4"
            >
              <Users className="mr-2 h-5 w-5" />
              Employee Management
            </TabsTrigger>
            <TabsTrigger 
              value="timesheet" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-8 py-4"
            >
              <Clock className="mr-2 h-5 w-5" />
              Timesheet
            </TabsTrigger>
            <TabsTrigger 
              value="payroll" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-8 py-4"
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Payroll Integration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quotes" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">Streamlined Quote Generation</h3>
                <p className="text-muted-foreground">Create and send professional quotes to clients with our customizable quote form system. Automated invoicing helps you manage billing efficiently.</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Custom quote templates
                  </li>
                  <li className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-primary" />
                    Automated invoice generation
                  </li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-16 w-16 text-primary/20" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scheduling" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">Intelligent Scheduling System</h3>
                <p className="text-muted-foreground">Match the right workers with the right shifts using our intelligent scheduling system. Track time and attendance with ease.</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Smart shift matching
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Time tracking & attendance
                  </li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-16 w-16 text-primary/20" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="management" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">Comprehensive Employee Management</h3>
                <p className="text-muted-foreground">Manage employee profiles, documents, and compliance requirements in one centralized system.</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Digital employee files
                  </li>
                  <li className="flex items-center gap-2">
                    <FileBarChart className="h-5 w-5 text-primary" />
                    Performance tracking
                  </li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="h-16 w-16 text-primary/20" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timesheet" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">Advanced Timesheet Management</h3>
                <p className="text-muted-foreground">Streamline time tracking with digital timesheets, automated calculations, and real-time reporting.</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Digital time tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <FileBarChart className="h-5 w-5 text-primary" />
                    Automated reporting
                  </li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-16 w-16 text-primary/20" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payroll" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">Seamless Payroll Integration</h3>
                <p className="text-muted-foreground">Automate your payroll process with direct integrations to popular payroll systems and automated payment processing.</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Automated payments
                  </li>
                  <li className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Direct deposit support
                  </li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-16 w-16 text-primary/20" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}