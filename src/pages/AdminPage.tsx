import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, Edit, Save, Trash2, X, Plus, ShoppingBag } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  active: boolean | null;
}

interface MenuItemFormValues {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  active: boolean;
}

const AdminPage = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('menu');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<MenuItemFormValues>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image_url: '',
      category: 'shawarma',
      active: true
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        navigate('/admin/login');
        return;
      }
      
      setIsAuthenticated(true);
      
      // Check if user is an admin
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (adminData) {
        setIsAdmin(true);
        fetchMenuItems();
      } else {
        setIsAdmin(false);
        toast({
          title: "Access denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        navigate('/');
      }
    };
    
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    if (editingItem) {
      form.reset({
        name: editingItem.name,
        description: editingItem.description || '',
        price: editingItem.price,
        image_url: editingItem.image_url || '',
        category: editingItem.category,
        active: editingItem.active || false
      });
    } else {
      form.reset({
        name: '',
        description: '',
        price: 0,
        image_url: '',
        category: 'shawarma',
        active: true
      });
    }
  }, [editingItem, form]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setItems(data);
      }
    } catch (error: any) {
      toast({
        title: "Error loading menu items",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleAddItem = async (values: MenuItemFormValues) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .insert([values]);

      if (error) throw error;
      
      toast({
        title: "Menu item added",
        description: `${values.name} has been added to the menu.`,
      });
      
      setIsAddFormOpen(false);
      form.reset();
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: "Error adding menu item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateItem = async (values: MenuItemFormValues) => {
    if (!editingItem) return;
    
    try {
      const { error } = await supabase
        .from('menu_items')
        .update(values)
        .eq('id', editingItem.id);

      if (error) throw error;
      
      toast({
        title: "Menu item updated",
        description: `${values.name} has been updated.`,
      });
      
      setEditingItem(null);
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: "Error updating menu item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Menu item deleted",
        description: `${name} has been removed from the menu.`,
      });
      
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: "Error deleting menu item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean | null, name: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ active: !currentActive })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: currentActive ? "Item hidden" : "Item activated",
        description: `${name} is now ${currentActive ? "hidden from" : "visible on"} the menu.`,
      });
      
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: "Error updating menu item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="section-container py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-2">
          <Button 
            onClick={() => navigate('/admin/orders')} 
            variant="outline"
            className="mr-2"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            View Orders
          </Button>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="menu">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Menu Items</span>
                <Button onClick={() => {
                  setIsAddFormOpen(!isAddFormOpen);
                  setEditingItem(null);
                }} size="sm">
                  {isAddFormOpen ? <X className="mr-1" /> : <Plus className="mr-1" />}
                  {isAddFormOpen ? "Cancel" : "Add Item"}
                </Button>
              </CardTitle>
              <CardDescription>
                Manage your menu items here. Add, edit, or remove items as needed.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isAddFormOpen && (
                <Card className="mb-6 border-dashed border-2">
                  <CardHeader>
                    <CardTitle>Add New Menu Item</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name*</FormLabel>
                              <FormControl>
                                <Input placeholder="Item name" required {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Item description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price*</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="Price" 
                                    required 
                                    {...field} 
                                    onChange={e => field.onChange(parseFloat(e.target.value))} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category*</FormLabel>
                                <FormControl>
                                  <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                                    {...field}
                                  >
                                    <option value="shawarma">Shawarma</option>
                                    <option value="paratha">Paratha</option>
                                    <option value="wrap">Wrap</option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="image_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input placeholder="Image URL" {...field} />
                              </FormControl>
                              <FormDescription>
                                Enter a URL for the item's image
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="active"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Active Status</FormLabel>
                                <FormDescription>
                                  Show this item on the menu
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsAddFormOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            Add Item
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
              
              {loading ? (
                <div className="text-center py-8">Loading menu items...</div>
              ) : items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No menu items found.</p>
                  <Button className="mt-4" onClick={() => setIsAddFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Menu Item
                  </Button>
                </div>
              ) : (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="capitalize">{item.category}</TableCell>
                          <TableCell>Rs. {item.price}</TableCell>
                          <TableCell>
                            <div 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {item.active ? 'Active' : 'Hidden'}
                            </div>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleToggleActive(item.id, item.active, item.name)}
                            >
                              {item.active ? 'Hide' : 'Show'}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setEditingItem(item);
                                setIsAddFormOpen(false);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteItem(item.id, item.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {editingItem && (
                <Collapsible className="mt-6 border rounded-md" defaultOpen>
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium">
                    <span>Edit: {editingItem.name}</span>
                    {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleUpdateItem)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name*</FormLabel>
                              <FormControl>
                                <Input placeholder="Item name" required {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Item description" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price*</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="Price" 
                                    required 
                                    {...field} 
                                    onChange={e => field.onChange(parseFloat(e.target.value))} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category*</FormLabel>
                                <FormControl>
                                  <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                                    {...field}
                                  >
                                    <option value="shawarma">Shawarma</option>
                                    <option value="paratha">Paratha</option>
                                    <option value="wrap">Wrap</option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="image_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input placeholder="Image URL" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormDescription>
                                Enter a URL for the item's image
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="active"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Active Status</FormLabel>
                                <FormDescription>
                                  Show this item on the menu
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setEditingItem(null)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            Update Item
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AdminPage;
