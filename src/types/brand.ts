export interface BrandConfig {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  accentColor: string;
  emberColor: string;
  bgGradients: string;
  packStyle: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    pattern: "chevron" | "stripes" | "crest" | "minimal" | "botanical";
    borderTone: string;
  };
  filterTone: "cork" | "white" | "gold-band" | "charcoal";
  soundProfile: "crisp" | "mellow" | "dense" | "smooth";
  image?: string;
}
