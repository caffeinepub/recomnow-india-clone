import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Loader2,
  LogOut,
  Package,
  Pencil,
  Plus,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  Category,
  FashionCategory,
  JewelleryCategory,
  Product,
} from "../backend.d";
import { useActor } from "../hooks/useActor";

// ─── Category helpers ────────────────────────────────────────────────────────

const FASHION_KEYS = new Set([
  "sarees",
  "kurtaKurtis",
  "festive",
  "gowns",
  "salwarSuits",
  "lehengaCholis",
  "westernWear",
  "sportsWear",
]);

function buildCategory(value: string): Category {
  if (FASHION_KEYS.has(value))
    return { __kind__: "fashion", fashion: value as FashionCategory };
  return { __kind__: "jewellery", jewellery: value as JewelleryCategory };
}

function getCategoryKey(cat: Category): string {
  if (cat.__kind__ === "fashion") return cat.fashion as string;
  return cat.jewellery as string;
}

function getCategoryLabel(cat: Category): string {
  const labels: Record<string, string> = {
    sarees: "Fashion › Sarees",
    kurtaKurtis: "Fashion › Kurta/Kurtis",
    festive: "Fashion › Festive",
    gowns: "Fashion › Gowns",
    salwarSuits: "Fashion › Salwar Suits",
    lehengaCholis: "Fashion › Lehenga Cholis",
    westernWear: "Fashion › Western Wear",
    sportsWear: "Fashion › Sports Wear",
    necklaces: "Jewellery › Necklaces",
    rings: "Jewellery › Rings",
  };
  return labels[getCategoryKey(cat)] ?? getCategoryKey(cat);
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProductFormData {
  title: string;
  description: string;
  imageUrl: string;
  affiliateLink: string;
  price: string;
  mrp: string;
  discountPercentage: string;
  categoryKey: string;
  isFeatured: boolean;
}

const EMPTY_FORM: ProductFormData = {
  title: "",
  description: "",
  imageUrl: "",
  affiliateLink: "",
  price: "",
  mrp: "",
  discountPercentage: "",
  categoryKey: "sarees",
  isFeatured: false,
};

const CATEGORY_OPTIONS = [
  { value: "sarees", label: "Fashion › Sarees" },
  { value: "kurtaKurtis", label: "Fashion › Kurta/Kurtis" },
  { value: "festive", label: "Fashion › Festive" },
  { value: "gowns", label: "Fashion › Gowns" },
  { value: "salwarSuits", label: "Fashion › Salwar Suits" },
  { value: "lehengaCholis", label: "Fashion › Lehenga Cholis" },
  { value: "westernWear", label: "Fashion › Western Wear" },
  { value: "sportsWear", label: "Fashion › Sports Wear" },
  { value: "necklaces", label: "Jewellery › Necklaces" },
  { value: "rings", label: "Jewellery › Rings" },
];

// ─── Props ───────────────────────────────────────────────────────────────────

interface AdminPageProps {
  navigate: (path: string) => void;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminPage({ navigate }: AdminPageProps) {
  const { actor, isFetching } = useActor();
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // On mount, validate any stored token
  useEffect(() => {
    if (isFetching || !actor) return;

    const stored = localStorage.getItem("adminToken");
    if (!stored) {
      setAuthLoading(false);
      return;
    }
    actor
      .validateAdminToken(stored)
      .then((valid) => {
        if (valid) setToken(stored);
        else localStorage.removeItem("adminToken");
      })
      .catch(() => localStorage.removeItem("adminToken"))
      .finally(() => setAuthLoading(false));
  }, [actor, isFetching]);

  const handleLoginSuccess = useCallback((t: string) => {
    localStorage.setItem("adminToken", t);
    setToken(t);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("adminToken");
    setToken(null);
    toast.success("Logged out successfully");
  }, []);

  if (isFetching || authLoading) {
    return (
      <div className="min-h-screen admin-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
      </div>
    );
  }

  if (!token || !actor) {
    return (
      <LoginScreen
        actor={actor}
        onSuccess={handleLoginSuccess}
        navigate={navigate}
      />
    );
  }

  return (
    <Dashboard
      actor={actor}
      token={token}
      onLogout={handleLogout}
      navigate={navigate}
    />
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

import type { backendInterface } from "../backend.d";

interface LoginScreenProps {
  actor: backendInterface | null;
  onSuccess: (token: string) => void;
  navigate: (path: string) => void;
}

function LoginScreen({ actor, onSuccess, navigate }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    if (!actor) {
      setError("Connection not ready. Please wait and try again.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await actor.adminLogin(username.trim(), password);
      // ICP optionals return as array: [value] for Some, [] for None
      const token = Array.isArray(result)
        ? result.length > 0
          ? result[0]
          : null
        : result;
      if (!token) {
        setError("Invalid username or password. Please try again.");
      } else {
        onSuccess(token as string);
        toast.success("Welcome back, Admin!");
      }
    } catch {
      setError("Login failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen admin-bg flex flex-col items-center justify-center p-4">
      {/* Back to store */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-admin-muted hover:text-admin-text transition-colors"
        data-ocid="admin.back.link"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Store
      </button>

      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 mb-4">
            <ShieldCheck className="h-8 w-8 text-gold-500" />
          </div>
          <h1 className="text-2xl font-bold text-admin-text tracking-tight">
            Admin Panel
          </h1>
          <p className="text-sm text-admin-muted mt-1">
            RecomNow India — Secure Login
          </p>
        </div>

        {/* Card */}
        <div className="admin-card rounded-2xl p-8 shadow-2xl border border-admin-border">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="admin-username"
                className="text-admin-text text-sm font-medium"
              >
                Username
              </Label>
              <Input
                id="admin-username"
                type="text"
                autoComplete="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                disabled={loading}
                data-ocid="admin.login_input"
                className="admin-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="admin-password"
                className="text-admin-text text-sm font-medium"
              >
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={loading}
                data-ocid="admin.password_input"
                className="admin-input"
              />
            </div>

            {error && (
              <div
                data-ocid="admin.error_state"
                className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-red-400"
                role="alert"
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !actor}
              data-ocid="admin.submit_button"
              className="w-full admin-btn-primary h-11"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-admin-muted mt-6">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gold-500 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

interface DashboardProps {
  actor: backendInterface;
  token: string;
  onLogout: () => void;
  navigate: (path: string) => void;
}

function Dashboard({ actor, token, onLogout, navigate }: DashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Product modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await actor.getAllProducts();
      setProducts(data);
    } catch {
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAddClick = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditTarget(product);
    setModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteTarget(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeletePending(true);
    try {
      await actor.deleteProduct(token, deleteTarget.id);
      toast.success(`"${deleteTarget.title}" deleted successfully.`);
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      await loadProducts();
    } catch {
      toast.error("Failed to delete product.");
    } finally {
      setDeletePending(false);
    }
  };

  const handleModalSaved = async () => {
    setModalOpen(false);
    setEditTarget(null);
    await loadProducts();
  };

  const totalProducts = products.length;
  const featuredCount = products.filter((p) => p.isFeatured).length;

  return (
    <div className="min-h-screen admin-bg flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 admin-header border-b border-admin-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30">
              <ShieldCheck className="h-4 w-4 text-gold-500" />
            </div>
            <span className="font-bold text-admin-text text-lg tracking-tight">
              RecomNow Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              data-ocid="admin.back.link"
              className="flex items-center gap-1.5 text-sm text-admin-muted hover:text-gold-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Store</span>
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              data-ocid="admin.logout.button"
              className="text-admin-muted hover:text-red-400 hover:bg-red-400/10 gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title + Add button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-admin-text">
              Product Management
            </h2>
            <p className="text-sm text-admin-muted mt-0.5">
              Manage your product catalogue
            </p>
          </div>
          <Button
            onClick={handleAddClick}
            data-ocid="admin.add_product.button"
            className="admin-btn-primary gap-2 w-full sm:w-auto text-white font-bold"
          >
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="admin-card border-admin-border">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-xs font-medium text-admin-muted uppercase tracking-wider flex items-center gap-2">
                <Package className="h-3.5 w-3.5" />
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <p className="text-3xl font-bold text-admin-text">
                {totalProducts}
              </p>
            </CardContent>
          </Card>
          <Card className="admin-card border-admin-border">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-xs font-medium text-admin-muted uppercase tracking-wider flex items-center gap-2">
                <Star className="h-3.5 w-3.5" />
                Featured
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <p className="text-3xl font-bold text-gold-500">
                {featuredCount}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <div className="admin-card rounded-xl border border-admin-border overflow-hidden">
          {loading ? (
            <div
              data-ocid="admin.products.loading_state"
              className="flex items-center justify-center py-20"
            >
              <Loader2 className="h-6 w-6 animate-spin text-gold-500" />
            </div>
          ) : products.length === 0 ? (
            <div
              data-ocid="admin.products.empty_state"
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Package className="h-10 w-10 text-admin-muted mb-3" />
              <p className="text-admin-text font-medium">No products yet</p>
              <p className="text-admin-muted text-sm mt-1">
                Click "Add New Product" to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="admin.products.table">
                <TableHeader>
                  <TableRow className="admin-table-header border-admin-border hover:bg-transparent">
                    <TableHead className="text-admin-muted font-semibold text-xs uppercase tracking-wider w-16">
                      ID
                    </TableHead>
                    <TableHead className="text-admin-muted font-semibold text-xs uppercase tracking-wider min-w-[180px]">
                      Title
                    </TableHead>
                    <TableHead className="text-admin-muted font-semibold text-xs uppercase tracking-wider hidden md:table-cell">
                      Category
                    </TableHead>
                    <TableHead className="text-admin-muted font-semibold text-xs uppercase tracking-wider text-right">
                      Price (₹)
                    </TableHead>
                    <TableHead className="text-admin-muted font-semibold text-xs uppercase tracking-wider text-right hidden sm:table-cell">
                      MRP (₹)
                    </TableHead>
                    <TableHead className="text-admin-muted font-semibold text-xs uppercase tracking-wider text-right hidden lg:table-cell">
                      Disc%
                    </TableHead>
                    <TableHead className="text-admin-muted font-semibold text-xs uppercase tracking-wider text-center hidden md:table-cell">
                      Featured
                    </TableHead>
                    <TableHead className="text-admin-muted font-semibold text-xs uppercase tracking-wider text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, idx) => (
                    <TableRow
                      key={String(product.id)}
                      data-ocid={`admin.product.row.${idx + 1}`}
                      className="admin-table-row border-admin-border"
                    >
                      <TableCell className="text-admin-muted text-xs font-mono">
                        {String(product.id)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-admin-text text-sm font-medium line-clamp-1">
                            {product.title}
                          </span>
                          <span className="text-admin-muted text-xs line-clamp-1 mt-0.5 hidden sm:block">
                            {product.description}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant="outline"
                          className="text-xs border-admin-border text-admin-muted whitespace-nowrap"
                        >
                          {getCategoryLabel(product.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-admin-text text-sm font-semibold">
                        ₹
                        {Math.round(Number(product.price) / 100).toLocaleString(
                          "en-IN",
                        )}
                      </TableCell>
                      <TableCell className="text-right text-admin-muted text-sm hidden sm:table-cell">
                        ₹
                        {Math.round(Number(product.mrp) / 100).toLocaleString(
                          "en-IN",
                        )}
                      </TableCell>
                      <TableCell className="text-right hidden lg:table-cell">
                        <span className="text-green-400 text-sm font-medium">
                          {String(product.discountPercentage)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        {product.isFeatured ? (
                          <Star className="h-4 w-4 text-gold-500 inline-block" />
                        ) : (
                          <span className="text-admin-muted text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEditClick(product)}
                            data-ocid={`admin.product.edit_button.${idx + 1}`}
                            className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                            aria-label={`Edit ${product.title}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteClick(product)}
                            data-ocid={`admin.product.delete_button.${idx + 1}`}
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            aria-label={`Delete ${product.title}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-admin-border py-5 text-center">
        <p className="text-xs text-admin-muted">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gold-500 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* Add / Edit Product Modal */}
      <ProductFormDialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        actor={actor}
        token={token}
        editProduct={editTarget}
        onSaved={handleModalSaved}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent
          data-ocid="delete.dialog"
          className="admin-dialog border-admin-border max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="text-admin-text">
              Delete Product
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-admin-muted text-sm">
              Are you sure you want to delete{" "}
              <span className="text-admin-text font-semibold">
                "{deleteTarget?.title}"
              </span>
              ? This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deletePending}
              data-ocid="delete.cancel_button"
              className="text-admin-muted hover:text-admin-text"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deletePending}
              data-ocid="delete.confirm_button"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletePending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Product Form Dialog ──────────────────────────────────────────────────────

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actor: backendInterface;
  token: string;
  editProduct: Product | null;
  onSaved: () => void;
}

function ProductFormDialog({
  open,
  onOpenChange,
  actor,
  token,
  editProduct,
  onSaved,
}: ProductFormDialogProps) {
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormData, string>>
  >({});

  // Sync form with edit target whenever dialog opens
  useEffect(() => {
    if (open) {
      if (editProduct) {
        // Backend stores price/MRP in paise; divide by 100 to show rupees in the form
        setForm({
          title: editProduct.title,
          description: editProduct.description,
          imageUrl: editProduct.imageUrl,
          affiliateLink: editProduct.affiliateLink,
          price: String(Math.round(Number(editProduct.price) / 100)),
          mrp: String(Math.round(Number(editProduct.mrp) / 100)),
          discountPercentage: String(Number(editProduct.discountPercentage)),
          categoryKey: getCategoryKey(editProduct.category),
          isFeatured: editProduct.isFeatured,
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
    }
  }, [open, editProduct]);

  const setField =
    (key: keyof ProductFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof ProductFormData, string>> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.imageUrl.trim()) errs.imageUrl = "Image URL is required";
    if (!form.affiliateLink.trim())
      errs.affiliateLink = "Affiliate link is required";
    if (
      !form.price ||
      Number.isNaN(Number(form.price)) ||
      Number(form.price) < 0
    )
      errs.price = "Valid price required";
    if (!form.mrp || Number.isNaN(Number(form.mrp)) || Number(form.mrp) < 0)
      errs.mrp = "Valid MRP required";
    if (
      form.discountPercentage === "" ||
      Number.isNaN(Number(form.discountPercentage)) ||
      Number(form.discountPercentage) < 0 ||
      Number(form.discountPercentage) > 100
    )
      errs.discountPercentage = "0–100 required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const category = buildCategory(form.categoryKey);
      // Backend stores prices in paise; multiply rupees by 100 before saving
      const price = BigInt(Math.round(Number(form.price) * 100));
      const mrp = BigInt(Math.round(Number(form.mrp) * 100));
      const disc = BigInt(Math.round(Number(form.discountPercentage)));

      if (editProduct) {
        await actor.updateProduct(
          token,
          editProduct.id,
          form.title.trim(),
          form.description.trim(),
          form.imageUrl.trim(),
          form.affiliateLink.trim(),
          price,
          mrp,
          disc,
          category,
          form.isFeatured,
        );
        toast.success("Product updated successfully!");
      } else {
        await actor.addProduct(
          token,
          form.title.trim(),
          form.description.trim(),
          form.imageUrl.trim(),
          form.affiliateLink.trim(),
          price,
          mrp,
          disc,
          category,
          form.isFeatured,
        );
        toast.success("Product added successfully!");
      }
      onSaved();
    } catch {
      toast.error("Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-ocid="product.form_dialog"
        className="admin-dialog border-admin-border max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-blue-800 text-lg font-bold">
            {editProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="mt-2 flex flex-col gap-5">
          {/* Title */}
          <FormField label="Title" error={errors.title} required>
            <Input
              value={form.title}
              onChange={setField("title")}
              placeholder="e.g. Banarasi Silk Saree"
              disabled={saving}
              data-ocid="product.title_input"
              className="admin-input"
            />
          </FormField>

          {/* Description */}
          <FormField label="Description" error={errors.description}>
            <Textarea
              value={form.description}
              onChange={setField("description")}
              placeholder="Product description…"
              rows={3}
              disabled={saving}
              data-ocid="product.description_input"
              className="admin-input resize-none"
            />
          </FormField>

          {/* Image URL */}
          <FormField label="Image URL" error={errors.imageUrl} required>
            <Input
              value={form.imageUrl}
              onChange={setField("imageUrl")}
              placeholder="https://…"
              disabled={saving}
              data-ocid="product.image_url_input"
              className="admin-input"
            />
          </FormField>

          {/* Affiliate Link */}
          <FormField
            label="Affiliate Link"
            error={errors.affiliateLink}
            required
          >
            <Input
              value={form.affiliateLink}
              onChange={setField("affiliateLink")}
              placeholder="https://amzn.to/…"
              disabled={saving}
              data-ocid="product.affiliate_link_input"
              className="admin-input"
            />
          </FormField>

          {/* Price / MRP / Discount row */}
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Price (₹)" error={errors.price} required>
              <Input
                value={form.price}
                onChange={setField("price")}
                placeholder="499"
                type="number"
                min="0"
                step="0.01"
                disabled={saving}
                data-ocid="product.price_input"
                className="admin-input"
              />
            </FormField>
            <FormField label="MRP (₹)" error={errors.mrp} required>
              <Input
                value={form.mrp}
                onChange={setField("mrp")}
                placeholder="999"
                type="number"
                min="0"
                step="0.01"
                disabled={saving}
                data-ocid="product.mrp_input"
                className="admin-input"
              />
            </FormField>
            <FormField
              label="Discount %"
              error={errors.discountPercentage}
              required
            >
              <Input
                value={form.discountPercentage}
                onChange={setField("discountPercentage")}
                placeholder="50"
                type="number"
                min="0"
                max="100"
                disabled={saving}
                data-ocid="product.discount_input"
                className="admin-input"
              />
            </FormField>
          </div>

          {/* Category */}
          <FormField label="Category" required>
            <Select
              value={form.categoryKey}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, categoryKey: val }))
              }
              disabled={saving}
            >
              <SelectTrigger
                data-ocid="product.category_select"
                className="admin-input w-full"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="admin-dialog border-admin-border">
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-admin-text focus:bg-gold-500/10 focus:text-admin-text"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Featured toggle */}
          <div className="flex items-center justify-between rounded-lg border border-admin-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-blue-800">
                Featured Product
              </p>
              <p className="text-xs text-blue-700">
                Show on home page highlights
              </p>
            </div>
            <Switch
              checked={form.isFeatured}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, isFeatured: checked }))
              }
              disabled={saving}
              data-ocid="product.featured_switch"
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={saving}
              data-ocid="product.cancel_button"
              className="text-admin-muted hover:text-admin-text"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              data-ocid="product.save_button"
              className="admin-btn-primary gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : editProduct ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── FormField helper ─────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-blue-800 text-sm font-semibold">
        {label}
        {required && <span className="text-amber-400 ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
