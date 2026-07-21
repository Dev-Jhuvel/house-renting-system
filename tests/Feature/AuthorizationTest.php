<?php
 
namespace Tests\Feature;
 
use App\Models\Bill;
use App\Models\Booking;
use App\Models\Deposit;
use App\Models\House;
use App\Models\Payment;
use App\Models\Room;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
 
class AuthorizationTest extends TestCase
{
    use RefreshDatabase;
 
    private User $landlordA;
    private User $landlordB;
 
    private House $house;
    private Room $room;
    private Tenant $tenant;
    private Booking $booking;
    private Bill $bill;
    private Payment $payment;
    private Deposit $deposit;
 
    protected function setUp(): void
    {
        parent::setUp();
 
        $this->landlordA = User::factory()->create(['role' => 'landlord']);
        $this->landlordB = User::factory()->create(['role' => 'landlord']);
 
        // Everything below belongs to landlordA, linked end to end,
        // exactly the chain landlordB should never be able to reach.
        $this->house = House::factory()->create(['user_id' => $this->landlordA->id]);
        $this->room = Room::factory()->create(['house_id' => $this->house->id]);
        $this->tenant = Tenant::factory()->create(['created_by' => $this->landlordA->id]);
        $this->booking = Booking::factory()->create([
            'room_id'   => $this->room->id,
            'tenant_id' => $this->tenant->id,
        ]);
        $this->bill = Bill::factory()->create(['booking_id' => $this->booking->id]);
        $this->payment = Payment::factory()->create(['bill_id' => $this->bill->id]);
        $this->deposit = Deposit::factory()->create(['booking_id' => $this->booking->id]);
    }
 
    // ---------------------------------------------------------------
    // House
    // ---------------------------------------------------------------
 
    public function test_landlord_cannot_view_another_landlords_house(): void
    {
        $this->actingAs($this->landlordB)
            ->get(route('houses.show', $this->house))
            ->assertForbidden();
    }
 
    public function test_landlord_cannot_update_another_landlords_house(): void
    {
        $this->actingAs($this->landlordB)
            ->put(route('houses.update', $this->house), [
                'name'          => 'Hijacked House',
                'address'       => 'Nowhere',
                'description'   => 'n/a',
                'city'          => 'Nowhere',
                'max_floor'     => 1,
                'max_room'      => 1,
                'water_rate'    => 10,
                'electric_rate' => 10,
                'status'        => 'active',
            ])
            ->assertForbidden();
    }
 
    public function test_landlord_cannot_delete_another_landlords_house(): void
    {
        $this->actingAs($this->landlordB)
            ->delete(route('houses.destroy', $this->house))
            ->assertForbidden();
 
        $this->assertModelExists($this->house);
    }
 
    // ---------------------------------------------------------------
    // Room
    // ---------------------------------------------------------------
 
    public function test_landlord_cannot_view_another_landlords_room(): void
    {
        $this->actingAs($this->landlordB)
            ->get(route('rooms.show', $this->room))
            ->assertForbidden();
    }
 
    public function test_landlord_cannot_update_another_landlords_room(): void
    {
        $this->actingAs($this->landlordB)
            ->put(route('rooms.update', $this->room), [
                'room_number'   => 'Hijacked-1',
                'description'   => 'n/a',
                'floor'         => 1,
                'type'          => 'single',
                'monthly_rent'  => 1000,
                'capacity'      => 1,
            ])
            ->assertForbidden();
    }
 
    public function test_landlord_cannot_delete_another_landlords_room(): void
    {
        $this->actingAs($this->landlordB)
            ->delete(route('rooms.destroy', $this->room))
            ->assertForbidden();
 
        $this->assertModelExists($this->room);
    }
 
    public function test_landlord_cannot_create_room_in_another_landlords_house(): void
    {
        $response = $this->actingAs($this->landlordB)
            ->post(route('rooms.store'), [
                'room_number'   => 'Sneaky-1',
                'description'   => 'n/a',
                'house_id'      => $this->house->id,
                'floor'         => 1,
                'type'          => 'single',
                'monthly_rent'  => 1000,
                'capacity'      => 1,
            ]);
 
        $response->assertSessionHasErrors('house_id');
        $this->assertDatabaseMissing('rooms', ['room_number' => 'Sneaky-1']);
    }
 
    // ---------------------------------------------------------------
    // Tenant
    // ---------------------------------------------------------------
 
    public function test_landlord_cannot_view_another_landlords_tenant(): void
    {
        $this->actingAs($this->landlordB)
            ->get(route('tenants.show', $this->tenant))
            ->assertForbidden();
    }
 
    public function test_landlord_cannot_update_another_landlords_tenant(): void
    {
        $this->actingAs($this->landlordB)
            ->put(route('tenants.update', $this->tenant), [
                'name'              => 'Hijacked Tenant',
                'email'             => $this->tenant->user->email,
                'phone'             => $this->tenant->phone,
                'address'           => 'Nowhere',
                'emergency_contact' => 'Nobody - 000',
                'id_type'           => 'National ID',
                'id_number'         => $this->tenant->id_number,
            ])
            ->assertForbidden();
    }
 
    public function test_landlord_cannot_delete_another_landlords_tenant(): void
    {
        $this->actingAs($this->landlordB)
            ->delete(route('tenants.destroy', $this->tenant))
            ->assertForbidden();
 
        $this->assertModelExists($this->tenant);
    }
 
    // ---------------------------------------------------------------
    // Booking
    // ---------------------------------------------------------------
 
    public function test_landlord_cannot_update_another_landlords_booking(): void
    {
        $this->actingAs($this->landlordB)
            ->put(route('bookings.update', $this->booking), [
                'move_in_date' => now()->toDateString(),
                'notes'        => 'hijacked',
            ])
            ->assertForbidden();
    }
 
    public function test_landlord_cannot_delete_another_landlords_booking(): void
    {
        $this->actingAs($this->landlordB)
            ->delete(route('bookings.destroy', $this->booking))
            ->assertForbidden();
 
        $this->assertModelExists($this->booking);
    }
 
    public function test_landlord_cannot_change_status_of_another_landlords_booking(): void
    {
        $this->actingAs($this->landlordB)
            ->patch(route('booking.updateBookingStatus', $this->booking), ['status' => 'active'])
            ->assertForbidden();
    }
 
    public function test_landlord_cannot_create_booking_with_another_landlords_tenant_and_room(): void
    {
        $response = $this->actingAs($this->landlordB)
            ->post(route('bookings.store'), [
                'tenant_id'    => $this->tenant->id,
                'room_id'      => $this->room->id,
                'move_in_date' => now()->toDateString(),
                'notes'        => 'sneaky booking',
            ]);
 
        $response->assertSessionHasErrors(['tenant_id', 'room_id']);
        $this->assertDatabaseMissing('bookings', ['notes' => 'sneaky booking']);
    }
 
    // ---------------------------------------------------------------
    // Bill
    // ---------------------------------------------------------------
 
    public function test_landlord_cannot_delete_another_landlords_bill(): void
    {
        $this->actingAs($this->landlordB)
            ->delete(route('bills.destroy', $this->bill))
            ->assertForbidden();
 
        $this->assertModelExists($this->bill);
    }
 
    public function test_landlord_cannot_create_bill_for_another_landlords_booking(): void
    {
        $response = $this->actingAs($this->landlordB)
            ->post(route('bills.store'), [
                'type'       => 'rent',
                'title'      => 'Sneaky Bill',
                'booking_id' => $this->booking->id,
                'amount'     => 1000,
                'bill_date'  => now()->toDateString(),
                'due_date'   => now()->addDays(10)->toDateString(),
            ]);
 
        $response->assertSessionHasErrors('booking_id');
        $this->assertDatabaseMissing('bills', ['title' => 'Sneaky Bill']);
    }
 
    // ---------------------------------------------------------------
    // Payment
    // ---------------------------------------------------------------
 
    public function test_landlord_cannot_record_payment_on_another_landlords_bill(): void
    {
        $response = $this->actingAs($this->landlordB)
            ->post(route('bills.payments.store', $this->bill), [
                'amount_paid' => 100,
                'paid_at'     => now()->toDateString(),
                'method'      => 'cash',
            ]);
 
        $response->assertForbidden();
        $this->assertDatabaseCount('payments', 1); // only the one from setUp
    }
 
    public function test_landlord_cannot_delete_a_payment_on_another_landlords_bill(): void
    {
        $this->actingAs($this->landlordB)
            ->delete(route('bills.payments.destroy', [
                'bill'    => $this->bill,
                'payment' => $this->payment,
            ]))
            ->assertForbidden();
 
        $this->assertModelExists($this->payment);
    }
 
    // ---------------------------------------------------------------
    // Deposit
    // ---------------------------------------------------------------
 
    public function test_landlord_cannot_record_deposit_on_another_landlords_booking(): void
    {
        $response = $this->actingAs($this->landlordB)
            ->post(route('bookings.deposits.store', $this->booking), [
                'amount'  => 500,
                'type'    => 'received',
            'paid_at' => now()->toDateString(),
            ]);
 
        $response->assertForbidden();
        $this->assertDatabaseCount('deposits', 1); // only the one from setUp
    }
 
    public function test_landlord_cannot_delete_another_landlords_deposit(): void
    {
        $this->actingAs($this->landlordB)
            ->delete(route('deposits.destroy', $this->deposit))
            ->assertForbidden();
 
        $this->assertModelExists($this->deposit);
    }
 
    // ---------------------------------------------------------------
    // Sanity check: landlordA can still manage their own data.
    // Without this, a bug that made every policy return false would
    // pass every test above for the wrong reason.
    // ---------------------------------------------------------------
 
    public function test_landlord_can_view_their_own_house(): void
    {
        $this->actingAs($this->landlordA)
            ->get(route('houses.show', $this->house))
            ->assertOk();
    }
 
    public function test_landlord_can_delete_their_own_deposit(): void
    {
        $this->actingAs($this->landlordA)
            ->delete(route('deposits.destroy', $this->deposit))
            ->assertRedirect();
 
        $this->assertModelMissing($this->deposit);
    }
}