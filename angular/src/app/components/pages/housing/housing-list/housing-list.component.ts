import { Component, OnInit, OnDestroy } from '@angular/core';
import { HousingService, BlockDto, UnitDto, CreateOrUpdateUnit, HousingDto, CreateBulkUnitsDto, UpdateBulkUnitsDto, DeleteBulkUnitsDto } from '@proxy/housings';
import { FloorResidentService, FloorResidentDto } from '@proxy/floor-residents';
import { firstValueFrom, Subscription } from 'rxjs';
import { UnitViewModel, BulkUnitItem, BulkUnitForm, BulkEditUnitItem } from '../housing.model';
import { EventService } from 'src/app/core/services/event.service';

@Component({
  selector: 'app-housing-list',
  templateUrl: './housing-list.component.html',
  styleUrls: ['./housing-list.component.scss']
})
export class HousingListComponent implements OnInit, OnDestroy {

  selectedHousing: HousingDto | null = null;
  blocks: BlockDto[] = [];
  units: UnitViewModel[] = [];
  filteredUnits: UnitViewModel[] = [];
  floorResidents: FloorResidentDto[] = [];

  readonly UNIT_TYPES = [
    'Daire',
    'Dükkan',
    'Ofis',
    'Villa',
    'Dubleks',
    'Penthouse',
    'Stüdyo',
    'Depo'
  ];

  searchText: string = '';
  selectedBlockId: string = '';
  selectedUnitType: string = '';

  // Sorting
  sortColumn: 'unitNumber' = 'unitNumber';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Selection
  selectedUnitIds: Set<string> = new Set<string>();

  // Single Unit Modal
  isSingleModalOpen: boolean = false;
  selectedUnit: UnitViewModel | null = null;
  isDeleteModalOpen: boolean = false;
  unitIdToDelete: string | null = null;

  form: Partial<CreateOrUpdateUnit> = {};
  validationError: string = '';
  loading: boolean = false;
  generalError: string = '';

  // Bulk Units Modal (Creation)
  isBulkModalOpen: boolean = false;
  isBulkSaving: boolean = false;
  bulkValidationError: string = '';
  bulkSuccessMessage: string = '';
  bulkProgress: { current: number; total: number } = { current: 0, total: 0 };

  bulkForm: BulkUnitForm = {
    blockId: '',
    count: 10,
    unitType: 'Daire',
    startingNumber: 1,
    prefix: '',
    startingFloor: 1,
    unitsPerFloor: 4,
    grossSquareMeters: undefined,
    netSquareMeters: undefined
  };

  bulkUnits: BulkUnitItem[] = [];

  // Bulk Edit Modal
  isBulkEditModalOpen: boolean = false;
  isBulkEditSaving: boolean = false;
  bulkEditValidationError: string = '';
  bulkEditSuccessMessage: string = '';
  bulkEditProgress: { current: number; total: number } = { current: 0, total: 0 };
  bulkEditUnits: BulkEditUnitItem[] = [];

  // Bulk Edit Quick Tool Fields
  bulkEditTargetFloor: number = 1;
  bulkEditStartFloor: number = 1;
  bulkEditUnitsPerFloor: number = 4;
  bulkEditTargetType: string = 'Daire';
  bulkEditTargetBlockId: string = '';
  bulkEditGrossM2?: number;
  bulkEditNetM2?: number;

  // Bulk Delete Modal
  isBulkDeleteModalOpen: boolean = false;
  isBulkDeleting: boolean = false;

  private housingSubscription?: Subscription;

  constructor(
    private housingService: HousingService,
    private floorResidentService: FloorResidentService,
    private eventService: EventService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadData();

    this.housingSubscription = this.eventService.subscribe('housingChanged', async () => {
      await this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.housingSubscription?.unsubscribe();
  }

  async loadData() {
    this.loading = true;
    this.generalError = '';
    try {
      const [housing, blocks, residents] = await Promise.all([
        firstValueFrom(this.housingService.getSelectedHousing()).catch(() => null as unknown as HousingDto),
        firstValueFrom(this.housingService.getBlockList()),
        firstValueFrom(this.floorResidentService.getFloorResidentList())
      ]);

      this.selectedHousing = housing;
      this.blocks = blocks || [];
      this.floorResidents = residents || [];

      const unitList = await firstValueFrom(this.housingService.getUnitList());

      this.units = (unitList || []).map(u => this.enrichUnit(u));
      this.filterUnits();
    } catch {
      this.generalError = 'Veriler yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyiniz.';
    } finally {
      this.loading = false;
    }
  }

  enrichUnit(unit: UnitDto): UnitViewModel {
    const owner = this.floorResidents.find(f => f.id === unit.homeOwnerId);
    const tenant = this.floorResidents.find(f => f.id === unit.hirerId);
    const block = this.blocks.find(b => b.id === unit.blockId);

    const parsedFloor = unit.floor !== null && unit.floor !== undefined ? Number(unit.floor) : 1;
    const floorNum = !isNaN(parsedFloor) ? parsedFloor : 1;

    return {
      ...unit,
      unitNumber: unit.unitNumber || unit.circleName || '',
      unitType: unit.unitType || 'Daire',
      floor: floorNum,
      blockName: unit.blockName || block?.blockName || '—',
      homeOwnerName: owner ? `${owner.name ?? ''} ${owner.surname ?? ''}`.trim() : undefined,
      hirerName: tenant ? `${tenant.name ?? ''} ${tenant.surname ?? ''}`.trim() : undefined,
    };
  }

  async refreshUnitsOnly(): Promise<void> {
    try {
      const unitList = await firstValueFrom(this.housingService.getUnitList());
      this.units = (unitList || []).map(u => this.enrichUnit(u));
      this.filterUnits();
    } catch {
      this.generalError = 'Daire listesi güncellenirken bir sorun oluştu.';
    }
  }

  private sortUnitsByNumber(list: UnitViewModel[]): UnitViewModel[] {
    return [...list].sort((a, b) => {
      const numA = (a.unitNumber || a.circleName || '').trim();
      const numB = (b.unitNumber || b.circleName || '').trim();
      const comparison = numA.localeCompare(numB, undefined, { numeric: true, sensitivity: 'base' });
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  sortByUnitNumber() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredUnits = this.sortUnitsByNumber(this.filteredUnits);
  }

  filterUnits() {
    const filtered = this.units.filter(u => {
      const unitNo = u.unitNumber || u.circleName || '';
      const matchesSearch = !this.searchText ||
        unitNo.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (u.homeOwnerName || '').toLowerCase().includes(this.searchText.toLowerCase()) ||
        (u.hirerName || '').toLowerCase().includes(this.searchText.toLowerCase());

      const matchesBlock = !this.selectedBlockId || u.blockId === this.selectedBlockId;
      const matchesType = !this.selectedUnitType || u.unitType === this.selectedUnitType;

      return matchesSearch && matchesBlock && matchesType;
    });

    this.filteredUnits = this.sortUnitsByNumber(filtered);
  }

  // --- Single Unit Operations ---
  openCreateModal() {
    this.selectedUnit = null;
    this.validationError = '';
    const defaultBlockId = (this.selectedBlockId && this.blocks.some(b => b.id === this.selectedBlockId))
      ? this.selectedBlockId
      : (this.blocks[0]?.id || '');
    this.form = {
      blockId: defaultBlockId,
      unitType: this.selectedUnitType || 'Daire',
      floor: 1,
      grossSquareMeters: undefined,
      netSquareMeters: undefined
    };
    this.isSingleModalOpen = true;
  }

  openEditModal(unit: UnitViewModel) {
    this.selectedUnit = unit;
    this.validationError = '';
    this.form = {
      blockId: unit.blockId,
      unitNumber: unit.unitNumber || unit.circleName,
      unitType: unit.unitType || 'Daire',
      floor: unit.floor !== null && unit.floor !== undefined ? unit.floor : 1,
      grossSquareMeters: unit.grossSquareMeters,
      netSquareMeters: unit.netSquareMeters,
      homeOwnerId: unit.homeOwnerId,
      hirerId: unit.hirerId
    };
    this.isSingleModalOpen = true;
  }

  getSelectedBlockMaxFloors(): number | undefined {
    const block = this.blocks.find(b => b.id === this.form.blockId);
    return (block?.totalFloors && block.totalFloors > 0) ? block.totalFloors : undefined;
  }

  async saveUnit() {
    this.validationError = '';
    const unitNo = (this.form.unitNumber || this.form.circleName || '').trim();

    if (!unitNo) {
      this.validationError = 'Bağımsız bölüm / kapı numarası zorunludur.';
      return;
    }
    if (!this.form.blockId) {
      this.validationError = 'Blok seçimi zorunludur.';
      return;
    }

    const rawFloor = parseInt(String(this.form.floor), 10);
    const validFloor = !isNaN(rawFloor) ? rawFloor : 0;

    const selectedBlock = this.blocks.find(b => b.id === this.form.blockId);
    if (validFloor < -10) {
      this.validationError = "Bulunduğu kat -10'dan küçük olamaz!";
      return;
    }
    if (selectedBlock?.totalFloors && selectedBlock.totalFloors > 0 && validFloor > selectedBlock.totalFloors) {
      this.validationError = `Bulunduğu kat (${validFloor}), bloğun maksimum kat sayısından (${selectedBlock.totalFloors}) büyük olamaz!`;
      return;
    }

    try {
      const prop: CreateOrUpdateUnit = {
        blockId: this.form.blockId,
        unitNumber: unitNo,
        unitType: this.form.unitType || 'Daire',
        floor: validFloor,
        grossSquareMeters: this.form.grossSquareMeters ? Number(this.form.grossSquareMeters) : undefined,
        netSquareMeters: this.form.netSquareMeters ? Number(this.form.netSquareMeters) : undefined,
        homeOwnerId: this.form.homeOwnerId || undefined,
        hirerId: this.form.hirerId || undefined,
      };

      if (this.selectedUnit && this.selectedUnit.id) {
        await firstValueFrom(this.housingService.updateUnit(this.selectedUnit.id, prop));
      } else {
        await firstValueFrom(this.housingService.createUnit(prop));
      }

      this.isSingleModalOpen = false;
      this.selectedUnit = null;
      await this.refreshUnitsOnly();
    } catch (err: any) {
      this.validationError = err.error?.error?.message || 'Kaydetme sırasında bir hata oluştu. Lütfen tekrar deneyiniz.';
    }
  }

  confirmDelete(id: string) {
    this.unitIdToDelete = id;
    this.isDeleteModalOpen = true;
  }

  async deleteUnit() {
    if (!this.unitIdToDelete) return;
    const id = this.unitIdToDelete;
    this.isDeleteModalOpen = false;
    this.unitIdToDelete = null;

    // Optimistic removal for instant UI response without flicker
    const previousUnits = [...this.units];
    this.units = this.units.filter(u => u.id !== id);
    this.filterUnits();

    try {
      await firstValueFrom(this.housingService.deleteUnit(id));
      await this.refreshUnitsOnly();
    } catch {
      this.units = previousUnits;
      this.filterUnits();
      this.generalError = 'Bağımsız bölüm silinirken bir hata oluştu. Lütfen tekrar deneyiniz.';
    }
  }

  // --- Bulk Units Operations ---
  openBulkModal() {
    this.bulkValidationError = '';
    this.bulkSuccessMessage = '';
    this.isBulkSaving = false;
    this.bulkProgress = { current: 0, total: 0 };

    const defaultBlockId = (this.selectedBlockId && this.blocks.some(b => b.id === this.selectedBlockId))
      ? this.selectedBlockId
      : (this.blocks[0]?.id || '');

    const selectedBlock = this.blocks.find(b => b.id === defaultBlockId);
    let defaultUnitsPerFloor = 4;
    if (selectedBlock?.totalFloors && selectedBlock.totalFloors > 0) {
      defaultUnitsPerFloor = Math.max(1, Math.round(10 / selectedBlock.totalFloors));
    }

    this.bulkForm = {
      blockId: defaultBlockId,
      count: 10,
      unitType: this.selectedUnitType || 'Daire',
      startingNumber: 1,
      prefix: '',
      startingFloor: 1,
      unitsPerFloor: defaultUnitsPerFloor,
      grossSquareMeters: undefined,
      netSquareMeters: undefined
    };
    this.generateBulkPreview();
    this.isBulkModalOpen = true;
  }

  onBulkBlockChange() {
    const selectedBlock = this.blocks.find(b => b.id === this.bulkForm.blockId);
    if (selectedBlock?.totalFloors && selectedBlock.totalFloors > 0) {
      const count = Number(this.bulkForm.count) || 10;
      this.bulkForm.unitsPerFloor = Math.max(1, Math.round(count / selectedBlock.totalFloors));
    }
    this.generateBulkPreview();
  }

  generateBulkPreview() {
    this.bulkValidationError = '';
    const rawCount = parseInt(String(this.bulkForm.count), 10);
    const count = !isNaN(rawCount) ? rawCount : 0;

    const rawStartNo = parseInt(String(this.bulkForm.startingNumber), 10);
    const startNo = !isNaN(rawStartNo) ? rawStartNo : 1;

    const rawStartFloor = parseInt(String(this.bulkForm.startingFloor), 10);
    const startFloor = !isNaN(rawStartFloor) ? rawStartFloor : 1;

    const rawUnitsPerFloor = parseInt(String(this.bulkForm.unitsPerFloor), 10);
    let unitsPerFloor = (!isNaN(rawUnitsPerFloor) && rawUnitsPerFloor > 0) ? rawUnitsPerFloor : 0;

    if (count <= 0) {
      this.bulkValidationError = 'Oluşturulacak daire adedi 1 veya daha büyük olmalıdır.';
      this.bulkUnits = [];
      return;
    }

    if (count > 300) {
      this.bulkValidationError = 'Tek seferde en fazla 300 bağımsız bölüm oluşturabilirsiniz.';
      return;
    }

    if (unitsPerFloor <= 0) {
      const selectedBlock = this.blocks.find(b => b.id === this.bulkForm.blockId);
      if (selectedBlock?.totalFloors && selectedBlock.totalFloors > 0) {
        unitsPerFloor = Math.max(1, Math.round(count / selectedBlock.totalFloors));
      } else {
        unitsPerFloor = 4;
      }
    }

    const previewList: BulkUnitItem[] = [];
    const prefix = (this.bulkForm.prefix || '').trim();

    for (let i = 0; i < count; i++) {
      const unitNumber = `${prefix}${startNo + i}`;
      const floor = startFloor + Math.floor(i / unitsPerFloor);

      previewList.push({
        unitNumber,
        unitType: this.bulkForm.unitType || 'Daire',
        floor,
        grossSquareMeters: this.bulkForm.grossSquareMeters ? Number(this.bulkForm.grossSquareMeters) : undefined,
        netSquareMeters: this.bulkForm.netSquareMeters ? Number(this.bulkForm.netSquareMeters) : undefined
      });
    }

    this.bulkUnits = previewList;
  }

  getFloorDistributionSummary(): string {
    if (this.bulkUnits.length === 0) return 'Oluşturulacak daire bulunmuyor.';
    const minFloor = this.bulkUnits[0]?.floor;
    const maxFloor = this.bulkUnits[this.bulkUnits.length - 1]?.floor;
    if (minFloor === maxFloor) {
      return `Tüm daireler ${minFloor}. Kata atanacak.`;
    }
    const floorSpan = maxFloor - minFloor + 1;
    return `Daireler ${minFloor}. Kattan ${maxFloor}. Kata kadar (${floorSpan} kat boyunca) dengeli dağıtıldı.`;
  }

  addBulkPreviewRow() {
    const lastUnit = this.bulkUnits[this.bulkUnits.length - 1];
    let newNumber = '1';
    let newFloor = 1;

    if (lastUnit) {
      const parsedNum = parseInt(lastUnit.unitNumber, 10);
      newNumber = isNaN(parsedNum) ? `${lastUnit.unitNumber}-1` : `${parsedNum + 1}`;
      newFloor = lastUnit.floor;
    }

    this.bulkUnits.push({
      unitNumber: newNumber,
      unitType: this.bulkForm.unitType || 'Daire',
      floor: newFloor,
      grossSquareMeters: this.bulkForm.grossSquareMeters,
      netSquareMeters: this.bulkForm.netSquareMeters
    });
  }

  removeBulkPreviewRow(index: number) {
    this.bulkUnits.splice(index, 1);
  }

  async saveBulkUnits() {
    this.bulkValidationError = '';
    this.bulkSuccessMessage = '';

    if (!this.bulkForm.blockId) {
      this.bulkValidationError = 'Lütfen dairelerin ekleneceği hedef bloğu seçiniz.';
      return;
    }

    if (this.bulkUnits.length === 0) {
      this.bulkValidationError = 'Oluşturulacak hiçbir daire bulunmamaktadır. Lütfen önizleme listesini kontrol ediniz.';
      return;
    }

    const hasEmptyUnitNumber = this.bulkUnits.some(d => !d.unitNumber || !d.unitNumber.trim());
    if (hasEmptyUnitNumber) {
      this.bulkValidationError = 'Tüm dairelerin kapı / birim numarası dolu olmalıdır.';
      return;
    }

    const selectedBlock = this.blocks.find(b => b.id === this.bulkForm.blockId);
    if (selectedBlock?.totalFloors && selectedBlock.totalFloors > 0) {
      const exceeding = this.bulkUnits.find(u => {
        const f = parseInt(String(u.floor), 10);
        return !isNaN(f) && f > selectedBlock.totalFloors!;
      });
      if (exceeding) {
        this.bulkValidationError = `Daire ${exceeding.unitNumber} için girilen kat (${exceeding.floor}), bloğun maksimum kat sayısından (${selectedBlock.totalFloors}) büyük olamaz!`;
        return;
      }
    }

    this.isBulkSaving = true;
    this.bulkProgress = { current: 0, total: this.bulkUnits.length };

    const bulkDto: CreateBulkUnitsDto = {
      blockId: this.bulkForm.blockId,
      units: this.bulkUnits.map(d => {
        const parsedFloor = parseInt(String(d.floor), 10);
        return {
          blockId: this.bulkForm.blockId,
          unitNumber: (d.unitNumber || '').trim(),
          unitType: d.unitType || 'Daire',
          floor: !isNaN(parsedFloor) ? parsedFloor : 0,
          grossSquareMeters: d.grossSquareMeters ? Number(d.grossSquareMeters) : undefined,
          netSquareMeters: d.netSquareMeters ? Number(d.netSquareMeters) : undefined
        };
      })
    };

    let isBulkApiSuccess = false;
    try {
      await firstValueFrom(this.housingService.createBulkUnits(bulkDto));
      isBulkApiSuccess = true;
      this.bulkProgress = { current: this.bulkUnits.length, total: this.bulkUnits.length };
    } catch {
      isBulkApiSuccess = false;
    }

    if (!isBulkApiSuccess) {
      let successCount = 0;
      for (let i = 0; i < this.bulkUnits.length; i++) {
        const d = this.bulkUnits[i];
        try {
          const parsedFloor = parseInt(String(d.floor), 10);
          const prop: CreateOrUpdateUnit = {
            blockId: this.bulkForm.blockId,
            unitNumber: (d.unitNumber || '').trim(),
            unitType: d.unitType || 'Daire',
            floor: !isNaN(parsedFloor) ? parsedFloor : 0,
            grossSquareMeters: d.grossSquareMeters ? Number(d.grossSquareMeters) : undefined,
            netSquareMeters: d.netSquareMeters ? Number(d.netSquareMeters) : undefined
          };
          await firstValueFrom(this.housingService.createUnit(prop));
          successCount++;
          this.bulkProgress = { current: successCount, total: this.bulkUnits.length };
        } catch {
          // Continue with next unit
        }
      }
    }

    this.isBulkSaving = false;
    this.bulkSuccessMessage = `${this.bulkUnits.length} adet bağımsız bölüm başarıyla oluşturuldu.`;
    await this.refreshUnitsOnly();

    setTimeout(() => {
      this.isBulkModalOpen = false;
      this.bulkSuccessMessage = '';
    }, 1500);
  }

  getBlockName(blockId?: string): string {
    return this.blocks.find(b => b.id === blockId)?.blockName || '—';
  }

  getTotalUnitsCount() { return this.units.length; }
  getOwnerOccupiedCount() { return this.units.filter(u => !!u.homeOwnerId).length; }
  getTenantOccupiedCount() { return this.units.filter(u => !!u.hirerId).length; }

  // --- Multi-Selection Operations ---
  isAllSelected(): boolean {
    if (this.filteredUnits.length === 0) return false;
    return this.filteredUnits.every(u => !!u.id && this.selectedUnitIds.has(u.id));
  }

  isIndeterminate(): boolean {
    const selectedCount = this.filteredUnits.filter(u => !!u.id && this.selectedUnitIds.has(u.id)).length;
    return selectedCount > 0 && selectedCount < this.filteredUnits.length;
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.filteredUnits.forEach(u => {
        if (u.id) this.selectedUnitIds.delete(u.id);
      });
    } else {
      this.filteredUnits.forEach(u => {
        if (u.id) this.selectedUnitIds.add(u.id);
      });
    }
  }

  toggleSelectUnit(id?: string): void {
    if (!id) return;
    if (this.selectedUnitIds.has(id)) {
      this.selectedUnitIds.delete(id);
    } else {
      this.selectedUnitIds.add(id);
    }
  }

  clearSelection(): void {
    this.selectedUnitIds.clear();
  }

  getSelectedCount(): number {
    return this.selectedUnitIds.size;
  }

  // --- Bulk Edit Operations ---
  openBulkEditModal(): void {
    if (this.selectedUnitIds.size === 0) {
      if (this.filteredUnits.length === 0) {
        this.generalError = 'Düzenlenecek bağımsız bölüm bulunamadı.';
        return;
      }
      this.filteredUnits.forEach(u => {
        if (u.id) this.selectedUnitIds.add(u.id);
      });
    }

    const selectedUnitsList = this.units.filter(u => !!u.id && this.selectedUnitIds.has(u.id));
    const sorted = [...selectedUnitsList].sort((a, b) => {
      const numA = (a.unitNumber || a.circleName || '').trim();
      const numB = (b.unitNumber || b.circleName || '').trim();
      return numA.localeCompare(numB, undefined, { numeric: true, sensitivity: 'base' });
    });

    this.bulkEditUnits = sorted.map(u => ({
      id: u.id!,
      unitNumber: u.unitNumber || u.circleName || '',
      blockId: u.blockId || '',
      blockName: u.blockName || this.getBlockName(u.blockId),
      unitType: u.unitType || 'Daire',
      floor: u.floor ?? 1,
      grossSquareMeters: u.grossSquareMeters,
      netSquareMeters: u.netSquareMeters,
      homeOwnerId: u.homeOwnerId,
      hirerId: u.hirerId
    }));

    this.bulkEditValidationError = '';
    this.bulkEditSuccessMessage = '';
    this.isBulkEditSaving = false;
    this.bulkEditTargetBlockId = this.bulkEditUnits[0]?.blockId || this.blocks[0]?.id || '';
    this.bulkEditTargetType = this.bulkEditUnits[0]?.unitType || 'Daire';
    this.bulkEditTargetFloor = this.bulkEditUnits[0]?.floor ?? 1;

    const floors = this.bulkEditUnits.map(u => u.floor).filter(f => !isNaN(f));
    this.bulkEditStartFloor = floors.length > 0 ? Math.min(...floors) : 1;
    this.bulkEditUnitsPerFloor = 4;
    this.bulkEditGrossM2 = undefined;
    this.bulkEditNetM2 = undefined;

    this.isBulkEditModalOpen = true;
  }

  applyFloorToAllBulkEdit(): void {
    const rawFloor = parseInt(String(this.bulkEditTargetFloor), 10);
    const floor = !isNaN(rawFloor) ? rawFloor : 0;
    this.bulkEditUnits.forEach(u => u.floor = floor);
  }

  applyFloorDistributionToBulkEdit(): void {
    const rawStart = parseInt(String(this.bulkEditStartFloor), 10);
    const startFloor = !isNaN(rawStart) ? rawStart : 0;
    const rawPerFloor = parseInt(String(this.bulkEditUnitsPerFloor), 10);
    const perFloor = (!isNaN(rawPerFloor) && rawPerFloor > 0) ? rawPerFloor : 4;

    this.bulkEditUnits.forEach((u, index) => {
      u.floor = startFloor + Math.floor(index / perFloor);
    });
  }

  applyTypeToAllBulkEdit(): void {
    if (!this.bulkEditTargetType) return;
    this.bulkEditUnits.forEach(u => u.unitType = this.bulkEditTargetType);
  }

  applyBlockToAllBulkEdit(): void {
    if (!this.bulkEditTargetBlockId) return;
    const targetBlock = this.blocks.find(b => b.id === this.bulkEditTargetBlockId);
    this.bulkEditUnits.forEach(u => {
      u.blockId = this.bulkEditTargetBlockId;
      u.blockName = targetBlock?.blockName || u.blockName;
    });
  }

  applyM2ToAllBulkEdit(): void {
    if (this.bulkEditGrossM2 !== undefined && this.bulkEditGrossM2 !== null && this.bulkEditGrossM2 !== ('' as any)) {
      this.bulkEditUnits.forEach(u => u.grossSquareMeters = Number(this.bulkEditGrossM2));
    }
    if (this.bulkEditNetM2 !== undefined && this.bulkEditNetM2 !== null && this.bulkEditNetM2 !== ('' as any)) {
      this.bulkEditUnits.forEach(u => u.netSquareMeters = Number(this.bulkEditNetM2));
    }
  }

  removeBulkEditRow(index: number): void {
    this.bulkEditUnits.splice(index, 1);
  }

  async saveBulkEditUnits(): Promise<void> {
    this.bulkEditValidationError = '';
    this.bulkEditSuccessMessage = '';

    if (this.bulkEditUnits.length === 0) {
      this.bulkEditValidationError = 'Düzenlenecek daire bulunamadı.';
      return;
    }

    const hasEmptyNo = this.bulkEditUnits.some(u => !u.unitNumber || !u.unitNumber.trim());
    if (hasEmptyNo) {
      this.bulkEditValidationError = 'Tüm dairelerin kapı numarası dolu olmalıdır.';
      return;
    }

    // Floor validation against block's totalFloors
    for (const item of this.bulkEditUnits) {
      const block = this.blocks.find(b => b.id === item.blockId);
      const f = parseInt(String(item.floor), 10);
      if (!isNaN(f) && f < -10) {
        this.bulkEditValidationError = `Daire ${item.unitNumber} için kat (${item.floor}), -10'dan küçük olamaz!`;
        return;
      }
      if (block?.totalFloors && block.totalFloors > 0 && !isNaN(f) && f > block.totalFloors) {
        this.bulkEditValidationError = `Daire ${item.unitNumber} için kat (${item.floor}), bloğun maksimum kat sayısından (${block.totalFloors}) büyük olamaz!`;
        return;
      }
    }

    this.isBulkEditSaving = true;
    this.bulkEditProgress = { current: 0, total: this.bulkEditUnits.length };

    const updateDto: UpdateBulkUnitsDto = {
      units: this.bulkEditUnits.map(u => ({
        id: u.id,
        blockId: u.blockId,
        unitNumber: u.unitNumber.trim(),
        unitType: u.unitType || 'Daire',
        floor: !isNaN(parseInt(String(u.floor), 10)) ? parseInt(String(u.floor), 10) : 0,
        grossSquareMeters: u.grossSquareMeters ? Number(u.grossSquareMeters) : undefined,
        netSquareMeters: u.netSquareMeters ? Number(u.netSquareMeters) : undefined,
        homeOwnerId: u.homeOwnerId,
        hirerId: u.hirerId
      }))
    };

    let isSuccess = false;
    try {
      await firstValueFrom(this.housingService.updateBulkUnits(updateDto));
      isSuccess = true;
      this.bulkEditProgress = { current: this.bulkEditUnits.length, total: this.bulkEditUnits.length };
    } catch {
      isSuccess = false;
    }

    if (!isSuccess) {
      // Fallback: update in loop
      let updatedCount = 0;
      for (const item of this.bulkEditUnits) {
        try {
          const prop: CreateOrUpdateUnit = {
            blockId: item.blockId,
            unitNumber: item.unitNumber.trim(),
            unitType: item.unitType || 'Daire',
            floor: !isNaN(parseInt(String(item.floor), 10)) ? parseInt(String(item.floor), 10) : 0,
            grossSquareMeters: item.grossSquareMeters ? Number(item.grossSquareMeters) : undefined,
            netSquareMeters: item.netSquareMeters ? Number(item.netSquareMeters) : undefined,
            homeOwnerId: item.homeOwnerId,
            hirerId: item.hirerId
          };
          await firstValueFrom(this.housingService.updateUnit(item.id, prop));
          updatedCount++;
          this.bulkEditProgress = { current: updatedCount, total: this.bulkEditUnits.length };
        } catch {
          // continue
        }
      }
    }

    this.isBulkEditSaving = false;
    this.bulkEditSuccessMessage = `${this.bulkEditUnits.length} adet bağımsız bölüm başarıyla güncellendi.`;
    this.selectedUnitIds.clear();
    await this.refreshUnitsOnly();

    setTimeout(() => {
      this.isBulkEditModalOpen = false;
      this.bulkEditSuccessMessage = '';
    }, 1200);
  }

  // --- Bulk Delete Operations ---
  openBulkDeleteModal(): void {
    if (this.selectedUnitIds.size === 0) return;
    this.isBulkDeleteModalOpen = true;
  }

  async confirmBulkDelete(): Promise<void> {
    if (this.selectedUnitIds.size === 0) return;
    this.isBulkDeleting = true;
    const idsToDelete = Array.from(this.selectedUnitIds);

    const previousUnits = [...this.units];
    this.units = this.units.filter(u => !u.id || !this.selectedUnitIds.has(u.id));
    this.filterUnits();
    this.selectedUnitIds.clear();
    this.isBulkDeleteModalOpen = false;

    let isSuccess = false;
    try {
      const chunkSize = 40;
      for (let i = 0; i < idsToDelete.length; i += chunkSize) {
        const chunk = idsToDelete.slice(i, i + chunkSize);
        await firstValueFrom(this.housingService.deleteBulkUnits({ unitIds: chunk }));
      }
      isSuccess = true;
    } catch {
      isSuccess = false;
    }

    if (!isSuccess) {
      try {
        await Promise.all(idsToDelete.map(id => firstValueFrom(this.housingService.deleteUnit(id))));
      } catch {
        this.generalError = 'Bazı daireler silinirken hata oluştu.';
      }
    }

    this.isBulkDeleting = false;
    await this.refreshUnitsOnly();
  }
}
