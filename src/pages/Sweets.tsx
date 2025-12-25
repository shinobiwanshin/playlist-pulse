import { useState, useEffect } from "react";
import { useOrganization, useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import UserButton from "@/components/auth/UserButton";
import { Loader2, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Sweet {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  org_id: string;
}

const Sweets = () => {
  const { organization, isLoaded: isOrgLoaded, membership } = useOrganization();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { toast } = useToast();

  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const isAdmin = membership?.role === "org:admin";

  useEffect(() => {
    if (isOrgLoaded && organization) {
      fetchSweets();
    } else {
      setIsLoading(false);
    }
  }, [isOrgLoaded, organization]);

  const fetchSweets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("sweets")
        .select("*")
        .eq("org_id", organization!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSweets(data || []);
    } catch (error) {
      console.error("Error fetching sweets:", error);
      toast({
        title: "Error",
        description: "Failed to load sweets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSweet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization || !isAdmin) return;

    setIsSubmitting(true);
    try {
      // Auto-generate image URL
      const imageUrl = `https://loremflickr.com/400/300/sweets,${encodeURIComponent(name)}?random=${Date.now()}`;

      const { error } = await supabase.from("sweets").insert({
        org_id: organization.id,
        name,
        price: parseFloat(price),
        description,
        image_url: imageUrl,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sweet added successfully!",
      });

      // Reset form and refresh list
      setName("");
      setPrice("");
      setDescription("");
      fetchSweets();
    } catch (error) {
      console.error("Error adding sweet:", error);
      toast({
        title: "Error",
        description: "Failed to add sweet",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuySweet = async (sweet: Sweet) => {
    if (!user || !organization) return;

    try {
      const { error } = await supabase.from("purchases").insert({
        org_id: organization.id,
        user_id: user.id,
        sweet_id: sweet.id,
      });

      if (error) throw error;

      toast({
        title: "Purchase Successful!",
        description: `You bought ${sweet.name}`,
      });
    } catch (error) {
      console.error("Error purchasing sweet:", error);
      toast({
        title: "Error",
        description: "Failed to purchase sweet",
        variant: "destructive",
      });
    }
  };

  if (!isOrgLoaded || !isUserLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="absolute top-4 right-4 z-50">
          <UserButton />
        </div>
        <div className="max-w-md mx-auto mt-20 text-center space-y-4">
          <h1 className="text-2xl font-bold">Welcome to the Sweets Shop</h1>
          <p className="text-muted-foreground">
            Please create or select an organization to continue.
          </p>
          <div className="flex justify-center">
            {/* The UserButton contains the OrganizationSwitcher */}
          </div>
          <Link to="/">
            <Button variant="ghost" className="mt-4 gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="absolute top-4 right-4 z-50">
        <UserButton />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 mt-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{organization.name} Sweets Shop</h1>
            <p className="text-muted-foreground mt-2">
              Role: <span className="font-medium text-foreground">{isAdmin ? "Admin" : "Member"}</span>
            </p>
          </div>
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
        </div>

        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Sweet</CardTitle>
              <CardDescription>Add a new item to the shop menu.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSweet} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Chocolate Cake"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">Price</label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Describe the sweet..."
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" /> Add Sweet
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Available Sweets</h2>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : sweets.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground border rounded-lg border-dashed">
              No sweets available yet. {isAdmin && "Add some above!"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sweets.map((sweet) => (
                <Card key={sweet.id} className="overflow-hidden flex flex-col">
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={sweet.image_url}
                      alt={sweet.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-xl">{sweet.name}</CardTitle>
                      <span className="font-bold text-primary whitespace-nowrap">
                        ${sweet.price.toFixed(2)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm">{sweet.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleBuySweet(sweet)}
                      variant="secondary"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> Buy Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sweets;
