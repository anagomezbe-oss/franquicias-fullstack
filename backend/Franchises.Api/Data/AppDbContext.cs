using Franchises.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Franchises.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Franchise> Franchises => Set<Franchise>();
    public DbSet<Branch> Branches => Set<Branch>();
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Franchise>().Property(x => x.Name).HasMaxLength(100).IsRequired();
        modelBuilder.Entity<Branch>().Property(x => x.Name).HasMaxLength(100).IsRequired();
        modelBuilder.Entity<Product>().Property(x => x.Name).HasMaxLength(100).IsRequired();
        modelBuilder.Entity<Franchise>().HasMany(x => x.Branches).WithOne(x => x.Franchise)
            .HasForeignKey(x => x.FranchiseId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Branch>().HasMany(x => x.Products).WithOne(x => x.Branch)
            .HasForeignKey(x => x.BranchId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Product>().ToTable(t => t.HasCheckConstraint("CK_Product_Stock_NonNegative", "\"Stock\" >= 0"));
    }
}
