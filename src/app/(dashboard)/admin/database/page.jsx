// src/app/(dashboard)/admin/database/page.jsx
"use client";

import { useState } from "react";
import {
  Database,
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Edit2,
  Trash2,
  Building,
  CheckCircle2,
  MapPin,
  Flame,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import {
  useGetDirectoryRecordsQuery,
  useGetDirectoryStatsQuery,
  useCreateDirectoryRecordMutation,
  useUpdateDirectoryRecordMutation,
  useDeleteDirectoryRecordMutation,
  useBulkImportDirectoryMutation,
} from "@/redux/api/directoryApi";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";

const DISTRICTS = [
  "All",
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Comilla",
  "Gazipur",
  "Narayanganj",
  "Bogra",
  "Cox's Bazar",
];

export default function AdminDatabasePage() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [importText, setImportText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    type: "dealer",
    businessName: "",
    district: "Dhaka",
    upazila: "",
    address: "",
    status: "verified",
    cylinderBrand: "Omera / Bashundhara",
    monthlyVolume: 50,
    licenseNumber: "",
  });

  const { data: dirData, isLoading, refetch } = useGetDirectoryRecordsQuery({
    type: selectedType !== "all" ? selectedType : undefined,
    district: selectedDistrict !== "All" ? selectedDistrict : undefined,
    search: searchQuery.trim() || undefined,
  });

  const { data: statsData } = useGetDirectoryStatsQuery();

  const [createRecord, { isLoading: isCreating }] = useCreateDirectoryRecordMutation();
  const [updateRecord, { isLoading: isUpdating }] = useUpdateDirectoryRecordMutation();
  const [deleteRecord, { isLoading: isDeleting }] = useDeleteDirectoryRecordMutation();
  const [bulkImport, { isLoading: isImporting }] = useBulkImportDirectoryMutation();

  const records = dirData?.data?.records || [];
  const total = dirData?.data?.total || 0;
  const stats = statsData?.data || {
    totalRecords: 10544480,
    indexedDealers: 64280,
    indexedConsumers: 10480200,
    districtsCovered: 64,
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      phone: "",
      type: "dealer",
      businessName: "",
      district: "Dhaka",
      upazila: "",
      address: "",
      status: "verified",
      cylinderBrand: "Omera / Bashundhara",
      monthlyVolume: 50,
      licenseNumber: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      phone: item.phone || "",
      type: item.type || "dealer",
      businessName: item.businessName || "",
      district: item.district || "Dhaka",
      upazila: item.upazila || "",
      address: item.address || "",
      status: item.status || "verified",
      cylinderBrand: item.cylinderBrand || "Omera / Bashundhara",
      monthlyVolume: item.monthlyVolume || 50,
      licenseNumber: item.licenseNumber || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.district) {
      toast.error("Please fill in Name, Phone, and District.");
      return;
    }

    try {
      if (editingItem) {
        await updateRecord({ id: editingItem._id, data: formData }).unwrap();
        toast.success("Database entry updated.");
      } else {
        await createRecord(formData).unwrap();
        toast.success("Database entry created.");
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save record.");
    }
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?._id) return;

    try {
      await deleteRecord(deleteTarget._id).unwrap();
      toast.success("Entry removed.");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error("Failed to delete record.");
    }
  };

  const handleBulkImportSubmit = async (e) => {
    e.preventDefault();
    if (!importText.trim()) {
      toast.error("Please paste CSV data.");
      return;
    }

    try {
      const lines = importText.trim().split("\n");
      const parsedRecords = lines.map((line, idx) => {
        const [name, phone, type, businessName, district, upazila, brand] = line.split(",").map((s) => s.trim());
        return {
          registrationId: `IMP-${Date.now().toString().slice(-4)}-${idx + 1}`,
          name: name || "Registered Entity",
          phone: phone || "01700000000",
          type: type === "consumer" ? "consumer" : "dealer",
          businessName: businessName || "",
          district: district || "Dhaka",
          upazila: upazila || "",
          cylinderBrand: brand || "Bashundhara",
          status: "verified",
        };
      });

      await bulkImport(parsedRecords).unwrap();
      toast.success(`Successfully imported ${parsedRecords.length} records!`);
      setIsImportModalOpen(false);
      setImportText("");
      refetch();
    } catch (err) {
      toast.error("Failed to process bulk import.");
    }
  };

  const handleExportCSV = () => {
    if (records.length === 0) {
      toast.error("No records available to export.");
      return;
    }

    const headers = "Registration ID,Name,Phone,Type,Business Name,District,Upazila,Brand,Volume\n";
    const rows = records
      .map(
        (r) =>
          `"${r.registrationId}","${r.name}","${r.phone}","${r.type}","${r.businessName || ""}","${r.district}","${r.upazila || ""}","${r.cylinderBrand || ""}","${r.monthlyVolume || 0}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `AEL_Database_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded successfully.");
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <AdminPageHeader
        icon={Database}
        title="Nationwide Database Management (1Cr+ Consumers, 60k+ Dealers)"
        description="High-throughput indexed database of verified LPG cylinder consumers, licensed retail dealers, and industrial manifold installations across all 64 districts."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="default"
              onClick={handleExportCSV}
              className="gap-2 bg-white"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>

            <Button
              variant="outline"
              size="default"
              onClick={() => setIsImportModalOpen(true)}
              className="gap-2 bg-white"
            >
              <Upload className="h-4 w-4" />
              <span>Bulk CSV Import</span>
            </Button>

            <Button
              variant="primary"
              size="default"
              onClick={handleOpenCreateModal}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Entry</span>
            </Button>
          </div>
        }
      />

      {/* 2. Scaled Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">Total Indexed Database</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {Number(stats.totalRecords).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            ✓ MongoDB Sharded Replica
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">Licensed Dealers</div>
          <div className="text-2xl font-black text-primary mt-1">
            {Number(stats.indexedDealers).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">DoE License Verified</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">Verified Consumers</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {Number(stats.indexedConsumers).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Household Cylinder Users</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">Districts Covered</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">64 / 64</div>
          <div className="text-[11px] text-slate-400 mt-1">495 Upazilas active</div>
        </div>
      </div>

      {/* 3. Filters & Search */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          {[
            { id: "all", label: "All Database" },
            { id: "dealer", label: "Licensed Dealers (60k+)" },
            { id: "consumer", label: "Consumers (1Cr+)" },
            { id: "industrial_client", label: "Industrial Clients" },
          ].map((t) => (
            <Button
              key={t.id}
              type="button"
              variant={selectedType === t.id ? "primary" : "secondary"}
              size="xs"
              onClick={() => setSelectedType(t.id)}
            >
              {t.label}
            </Button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full sm:w-44 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-hidden focus:border-primary"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d === "All" ? "All Districts (64)" : d}
              </option>
            ))}
          </select>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search name, phone, Reg ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<Search className="h-4 w-4 text-slate-400" />}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* 4. Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration ID & Name</TableHead>
              <TableHead>Phone / Contact</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Business / Facility</TableHead>
              <TableHead>District & Upazila</TableHead>
              <TableHead>Cylinder Brand</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-slate-400 text-xs">
                  Loading database records...
                </TableCell>
              </TableRow>
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-slate-400 text-xs">
                  No directory records found matching criteria.
                </TableCell>
              </TableRow>
            ) : (
              records.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-mono font-bold text-xs text-primary">
                        {item.registrationId}
                      </div>
                      <div className="font-bold text-xs text-slate-900">{item.name}</div>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono text-xs font-bold text-slate-700">
                    {item.phone}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                        item.type === "dealer"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : item.type === "consumer"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}
                    >
                      {item.type}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs text-slate-600 max-w-xs">
                    {item.businessName || "—"}
                  </TableCell>

                  <TableCell className="text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>
                        {item.district} {item.upazila ? `(${item.upazila})` : ""}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-slate-700">
                    <div>{item.cylinderBrand || "Standard"}</div>
                    <div className="text-[10px] text-slate-400">
                      {item.monthlyVolume} cyl/mo
                    </div>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.status === "verified"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleOpenEditModal(item)}
                        title="Edit entry"
                        icon={Edit2}
                      />
                      <Button
                        type="button"
                        variant="danger-ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(item)}
                        title="Delete entry"
                        icon={Trash2}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 5. Add / Edit Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="lg"
        title={editingItem ? "Edit Directory Entry" : "Add Database Entry"}
        description="Fill in the contact information, dealership/consumer category, and location."
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <Input
                required
                placeholder="e.g. Mohammad Hossain"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Phone *
              </label>
              <Input
                required
                placeholder="e.g. 01711998877"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-hidden focus:border-primary"
              >
                <option value="dealer">Licensed Dealer</option>
                <option value="consumer">Household Consumer</option>
                <option value="industrial_client">Industrial Client</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                District *
              </label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-hidden focus:border-primary"
              >
                {DISTRICTS.filter((d) => d !== "All").map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Upazila / Thana
              </label>
              <Input
                placeholder="e.g. Mirpur"
                value={formData.upazila}
                onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Business / Enterprise Name
              </label>
              <Input
                placeholder="e.g. Hossain Gas & Cylinder Agency"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Government License No. (if dealer)
              </label>
              <Input
                placeholder="e.g. DOE-LPG-DHK-2018-882"
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, licenseNumber: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Associated Cylinder Brand
              </label>
              <Input
                placeholder="e.g. Bashundhara, Omera, Jamuna"
                value={formData.cylinderBrand}
                onChange={(e) =>
                  setFormData({ ...formData, cylinderBrand: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Monthly Volume (Cylinders)
              </label>
              <Input
                type="number"
                placeholder="50"
                value={formData.monthlyVolume}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monthlyVolume: Number(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Physical Address
            </label>
            <Input
              placeholder="e.g. Plot 12, Section 10, Mirpur, Dhaka-1216"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isCreating || isUpdating}
            >
              {editingItem ? "Update Entry" : "Save to Database"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* 6. Bulk CSV Import Modal */}
      <Dialog
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        maxWidth="lg"
        title="Bulk CSV Data Stream Import"
        description="Paste comma-separated rows to batch-import verified dealers and consumers directly into the database."
      >
        <form onSubmit={handleBulkImportSubmit} className="p-6 space-y-4">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
            <strong className="text-slate-900 block mb-1">Required CSV Column Format:</strong>
            <code>Name, Phone, Type(dealer/consumer), Business Name, District, Upazila, Cylinder Brand</code>
            <p className="mt-1 text-[11px] text-slate-500">
              Example: <code>Kamal Uddin, 01711223344, dealer, Meghna Gas Agency, Chittagong, Agrabad, Total</code>
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              CSV Content *
            </label>
            <textarea
              required
              rows={8}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste raw CSV lines here..."
              className="w-full rounded-xl border border-slate-200 p-3 font-mono text-xs text-slate-800 outline-hidden focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsImportModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isImporting}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              <span>Import Records</span>
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Remove Database Record"
        description="Are you sure you want to permanently delete this LPG dealer/entity record from the central database?"
        itemTitle={
          deleteTarget
            ? `${deleteTarget.name || "Entity"} - ${deleteTarget.phone || deleteTarget.district || ""}`
            : ""
        }
        confirmText="Remove Record"
      />
    </div>
  );
}
