import type { CascaderOption } from "@/components/ui/cascader";

type AdminRegionNode = {
  value: string;
  label: string;
  children?: AdminRegionNode[];
};

const GAMBIA_ADMIN_REGION_TREE: AdminRegionNode[] = [
  {
    value: "banjul-city",
    label: "Banjul (City)",
    children: [
      {
        value: "banjul",
        label: "Banjul",
        children: [
          { value: "banjul-central", label: "Banjul Central" },
          { value: "banjul-north", label: "Banjul North" },
          { value: "banjul-south", label: "Banjul South" },
        ],
      },
    ],
  },
  {
    value: "west-coast-region",
    label: "West Coast Region",
    children: [
      {
        value: "brikama",
        label: "Brikama",
        children: [
          { value: "foni-bintang-karanai", label: "Foni Bintang-Karanai" },
          { value: "foni-bondali", label: "Foni Bondali" },
          { value: "foni-brefet", label: "Foni Brefet" },
          { value: "foni-jarrol", label: "Foni Jarrol" },
          { value: "foni-kansala", label: "Foni Kansala" },
          { value: "kombo-central", label: "Kombo Central" },
          { value: "kombo-east", label: "Kombo East" },
          { value: "kombo-north", label: "Kombo North" },
          { value: "kombo-south", label: "Kombo South" },
        ],
      },
      {
        value: "kanifing",
        label: "Kanifing",
        children: [{ value: "kanifing", label: "Kanifing" }],
      },
    ],
  },
  {
    value: "north-bank-region",
    label: "North Bank Region",
    children: [
      {
        value: "kerewan",
        label: "Kerewan",
        children: [
          { value: "central-badibu", label: "Central Badibu" },
          { value: "illiasa", label: "Illiasa" },
          { value: "jokadu", label: "Jokadu" },
          { value: "lower-badibu", label: "Lower Badibu" },
          { value: "lower-niumi", label: "Lower Niumi" },
          { value: "sabach-sanjal", label: "Sabach Sanjal" },
          { value: "upper-niumi", label: "Upper Niumi" },
        ],
      },
    ],
  },
  {
    value: "lower-river-region",
    label: "Lower River Region",
    children: [
      {
        value: "mansakonko",
        label: "Mansakonko",
        children: [
          { value: "jarra-central", label: "Jarra Central" },
          { value: "jarra-east", label: "Jarra East" },
          { value: "jarra-west", label: "Jarra West" },
          { value: "kiang-central", label: "Kiang Central" },
          { value: "kiang-east", label: "Kiang East" },
          { value: "kiang-west", label: "Kiang West" },
        ],
      },
    ],
  },
  {
    value: "central-river-region",
    label: "Central River Region",
    children: [
      {
        value: "kuntaur",
        label: "Kuntaur",
        children: [
          { value: "lower-saloum", label: "Lower Saloum" },
          { value: "niani", label: "Niani" },
          { value: "nianija", label: "Nianija" },
          { value: "sami", label: "Sami" },
          { value: "upper-saloum", label: "Upper Saloum" },
        ],
      },
      {
        value: "janjanbureh",
        label: "Janjanbureh",
        children: [
          { value: "janjanbureh", label: "Janjanbureh" },
          { value: "niamina-dankunku", label: "Niamina Dankunku" },
          { value: "niamina-east", label: "Niamina East" },
          { value: "niamina-west", label: "Niamina West" },
          { value: "fulladu-west", label: "Fulladu West" },
        ],
      },
    ],
  },
  {
    value: "upper-river-region",
    label: "Upper River Region",
    children: [
      {
        value: "basse",
        label: "Basse",
        children: [
          { value: "basse-fuladu-east", label: "Basse Fuladu East" },
          { value: "jimara", label: "Jimara" },
          { value: "kantora", label: "Kantora" },
          { value: "sandu", label: "Sandu" },
          { value: "tumana", label: "Tumana" },
          { value: "wuli-east", label: "Wuli East" },
          { value: "wuli-west", label: "Wuli West" },
        ],
      },
    ],
  },
];

function toCascaderOptions(nodes: AdminRegionNode[]): CascaderOption[] {
  return nodes.map((node) => ({
    value: node.value,
    label: node.label,
    textLabel: node.label,
    children: node.children ? toCascaderOptions(node.children) : undefined,
  }));
}

export const GAMBIA_ADMIN_REGION_OPTIONS =
  toCascaderOptions(GAMBIA_ADMIN_REGION_TREE);

/** Full district path assigned to each demo school (region → LGA → district). */
export const SCHOOL_ADMIN_REGION_DISTRICTS: Record<number, string[]> = {
  1: ["west-coast-region", "brikama", "kombo-south"],
  2: ["north-bank-region", "kerewan", "upper-niumi"],
  3: ["central-river-region", "janjanbureh", "niamina-east"],
  4: ["upper-river-region", "basse", "kantora"],
  5: ["banjul-city", "banjul", "banjul-central"],
};

export function getAdminRegionLabels(path: string[]): string[] {
  const labels: string[] = [];
  let nodes = GAMBIA_ADMIN_REGION_TREE;

  for (const segment of path) {
    const node = nodes.find((entry) => entry.value === segment);
    if (!node) break;
    labels.push(node.label);
    nodes = node.children ?? [];
  }

  return labels;
}

export function formatAdminRegionDisplay(path: string[]): string {
  const labels = getAdminRegionLabels(path);
  return labels[labels.length - 1] ?? "";
}

export function formatAdminRegionFullPath(path: string[]): string {
  return getAdminRegionLabels(path).join(" / ");
}

export function adminRegionPathsMatch(
  reportPath: string[],
  filterPath: string[],
): boolean {
  if (filterPath.length === 0) return true;
  if (reportPath.length < filterPath.length) return false;

  for (let index = 0; index < filterPath.length; index += 1) {
    if (reportPath[index] !== filterPath[index]) {
      return false;
    }
  }
  return true;
}

export function assignAdminRegionPath(
  schoolId: number,
  rand: () => number,
): string[] {
  const fullPath =
    SCHOOL_ADMIN_REGION_DISTRICTS[schoolId] ??
    SCHOOL_ADMIN_REGION_DISTRICTS[1]!;
  const precision = rand();

  if (precision < 0.38) return fullPath;
  if (precision < 0.72) return fullPath.slice(0, 2);
  return fullPath.slice(0, 1);
}
