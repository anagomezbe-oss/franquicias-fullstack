using Franchises.Api.Data;
using Franchises.Api.DTOs;
using Franchises.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Franchises.Api.Controllers;
[ApiController, Route("api/[controller]")]
public class ProductsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll([FromQuery] int? branchId)
    {
        var query = db.Products.AsNoTracking().AsQueryable();
        if (branchId.HasValue) query = query.Where(x => x.BranchId == branchId.Value);
        return Ok(await query.OrderBy(x => x.Name).ToListAsync());
    }
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetById(int id)
    {
        var item = await db.Products.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return item is null ? NotFound(new { message = "Product not found." }) : Ok(item);
    }
    [HttpPost]
    public async Task<ActionResult<Product>> Create(CreateProductRequest request)
    {
        if (!await db.Branches.AnyAsync(x => x.Id == request.BranchId))
            return BadRequest(new { message = "The selected branch does not exist." });
        var item = new Product { BranchId = request.BranchId, Name = request.Name.Trim(), Stock = request.Stock };
        db.Products.Add(item); await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }
    [HttpPatch("{id:int}/stock")]
    public async Task<ActionResult<Product>> UpdateStock(int id, UpdateStockRequest request)
    {
        var item = await db.Products.FindAsync(id);
        if (item is null) return NotFound(new { message = "Product not found." });
        item.Stock = request.Stock;
        await db.SaveChangesAsync();
        return Ok(item);
    }
}
